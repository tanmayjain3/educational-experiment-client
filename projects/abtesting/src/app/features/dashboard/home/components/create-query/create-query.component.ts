import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { OPERATION_TYPES, Query, METRICS_JOIN_TEXT } from '../../../../../core/analysis/store/analysis.models';
import { AnalysisService } from '../../../../../core/analysis/analysis.service';
import { ExperimentVM } from '../../../../../core/experiments/store/experiments.model';
import { ExperimentService } from '../../../../../core/experiments/experiments.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-create-query',
  templateUrl: './create-query.component.html',
  styleUrls: ['./create-query.component.scss'],
})
export class CreateQueryComponent implements OnInit, OnDestroy {
  @Input() experimentInfo: ExperimentVM;

  // Used for displaying metrics
  allMetricsSub: Subscription;
  isAnalysisMetricsLoading$ = this.analysisService.isMetricsLoading$;

  queryOperations = [];

  comparisonFns = [
    { value: '=', viewValue: 'equal' },
    { value: '<>', viewValue: 'not equal' }
  ];
  metricSelectionForm: FormGroup;
  filteredOptions: Observable<any[]>[] = [];
  options: any[] = [];
  isKeySelected = false;

  @ViewChild('metricsTable', { static: false }) metricsTable: ElementRef;

  constructor(
    private analysisService: AnalysisService,
    private experimentService: ExperimentService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.allMetricsSub = this.analysisService.allMetrics$.subscribe(metrics => {
      this.options[0] = metrics;
    });

    this.metricSelectionForm = this.fb.group({
      keys: this.fb.array([this.addKeys()]),
      queryName: [null, Validators.required],
      operationType: [null, Validators.required],
      compareFn: [null],
      compareValue: [null]
    });
    this.ManageNameControl(0);
  }

  get keys() {
    return this.metricSelectionForm.get('keys') as FormArray;
  }

  addKeys() {
    return this.fb.group({
      metricKey: [null, Validators.required]
    });
  }

  removeKey(index) {
    this.keys.removeAt(index);
  }

  ManageNameControl(index: number) {
    const arrayControl = this.metricSelectionForm.get('keys') as FormArray;
    this.filteredOptions[index] = arrayControl.at(index).get('metricKey').valueChanges
      .pipe(
      startWith<string>(''),
      map(key => {
        for (let i = index - 1; i >= 0; i--) {
          arrayControl.at(i).disable();
        }
        if (index - 1 >= 0) {
          const { metricKey } = arrayControl.at(index - 1).value;
          this.options[index] = metricKey.children;
        }
        return key ? this._filter(key, index) : this.options[index] ? this.options[index].slice() : [];
      })
      );
  }

  resetForm() {
    this.keys.clear();
    this.metricSelectionForm.reset();
    this.options = [this.options[0]];
    this.filteredOptions = [];
    this.keys.push(this.addKeys());
    this.ManageNameControl(0);
    this.isKeySelected = false;
  }

  displayFn(node?: any): string | undefined {
    return node ? node.key : undefined;
  }

  private _filter(key: any, index): any[] {
    let filterValue;
    if (typeof key === 'string') {
      filterValue = key.toLowerCase();
    } else {
      filterValue = key.key.toLowerCase();
    }

    return this.options[index].filter(option => option.key.toLowerCase().indexOf(filterValue) === 0);
  }

  addMoreSelectKey() {
    const controls = <FormArray>this.metricSelectionForm.controls['keys'];
    const formGroup = this.addKeys();
    controls.push(formGroup);
    // Build the account Auto Complete values
    this.ManageNameControl(controls.length - 1);
  }

  selectedOption(event) {
    if (event.option.value) {
      if (event.option.value.children.length) {
        this.addMoreSelectKey();
      } else {
        this.isKeySelected = true;
        const controls = <FormArray>this.metricSelectionForm.controls['keys'];
        controls.at(controls.length - 1).disable();
        const { keys } = this.metricSelectionForm.getRawValue();
        const leafNode = keys[keys.length - 1].metricKey.metadata;
        if (leafNode && leafNode.type === 'continuous') {
          this.queryOperations = [
            { value: OPERATION_TYPES.SUM, viewValue: 'Sum' },
            { value: OPERATION_TYPES.MIN, viewValue: 'Min' },
            { value: OPERATION_TYPES.MAX, viewValue: 'Max' },
            { value: OPERATION_TYPES.COUNT, viewValue: 'Count' },
            { value: OPERATION_TYPES.AVERAGE, viewValue: 'Average' },
            { value: OPERATION_TYPES.MODE, viewValue: 'Mode' },
            { value: OPERATION_TYPES.MEDIAN, viewValue: 'Median' },
            { value: OPERATION_TYPES.STDEV, viewValue: 'Standard Deviation' }
          ];
        } else if (leafNode && leafNode.type === 'categorical') {
          this.queryOperations = [
            { value: OPERATION_TYPES.COUNT, viewValue: 'Count' },
            { value: 'percent', viewValue: 'Percent' }
          ];
        }
      }
    }
  }

  saveQuery() {
    const { operationType, queryName, compareFn, compareValue } = this.metricSelectionForm.getRawValue();
    let { keys } = this.metricSelectionForm.getRawValue();
    keys = keys.map(key => key.metricKey.key);
    let queryObj: Query = {
      name: queryName,
      query: {
        operationType
      },
      metric: {
        key: keys.join(METRICS_JOIN_TEXT)
      },
    };
    if (compareFn && !!compareValue) {
      queryObj = {
        ...queryObj,
        query: {
          ...queryObj.query,
          compareFn,
          compareValue
        }
      }
    }
    this.experimentInfo.queries = [ ...this.experimentInfo.queries, queryObj];
    this.experimentService.updateExperiment(this.experimentInfo);
  }

  ngOnDestroy() {
    this.allMetricsSub.unsubscribe();
  }
}
