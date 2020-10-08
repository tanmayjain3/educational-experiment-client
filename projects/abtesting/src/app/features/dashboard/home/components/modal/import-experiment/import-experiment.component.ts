import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {  POST_EXPERIMENT_RULE, EXPERIMENT_STATE, CONSISTENCY_RULE, ASSIGNMENT_UNIT, Experiment, ExperimentCondition, ExperimentPartition } from '../../../../../../core/experiments/store/experiments.model';
import * as uuid from 'uuid';
import { ExperimentService } from '../../../../../../core/experiments/experiments.service';

@Component({
  selector: 'app-import-experiment',
  templateUrl: './import-experiment.component.html',
  styleUrls: ['./import-experiment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportExperimentComponent {

  expName: string;
  file: any;
  parsedData : any;
  experimentInfo: Experiment;
  constructor(
    private experimentService: ExperimentService,
    public dialogRef: MatDialogRef<ImportExperimentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  importExperiment() {
    this.experimentService.importExperiment({...this.experimentInfo, queries: []});
    this.onCancelClick();
  }

  fileUploaded(event) {
    const reader = new FileReader()
    reader.addEventListener('load', function() {
      const result = JSON.parse((reader.result as any));
      this.experimentInfo = result;
    }.bind(this));
    reader.readAsText(event.target.files[0]);
  }
}
