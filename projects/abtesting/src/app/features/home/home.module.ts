import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { HomeComponent } from './root/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ExperimentListComponent } from './components/experiment-list/experiment-list.component';
import { ExperimentStateColorPipe } from './pipes/experiment-state-color.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { FormsModule } from '@angular/forms';
import { NewExperimentComponent } from './components/modal/new-experiment/new-experiment.component';
import { ExperimentOverviewComponent } from './components/experiment-overview/experiment-overview.component';
import { ExperimentDesignComponent } from './components/experiment-design/experiment-design.component';
import { ExperimentScheduleComponent } from './components/experiment-schedule/experiment-schedule.component';
import { ViewExperimentComponent } from './pages/view-experiment/view-experiment.component';
import { ExperimentStatusComponent } from './components/modal/experiment-status/experiment-status.component';
import { PostExperimentRuleComponent } from './components/modal/post-experiment-rule/post-experiment-rule.component';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker'
import { MatDatepickerModule } from '@angular/material';

@NgModule({
  declarations: [
    HomeComponent,
    ExperimentListComponent,
    ExperimentStateColorPipe,
    FormatDatePipe,
    NewExperimentComponent,
    ExperimentOverviewComponent,
    ExperimentDesignComponent,
    ExperimentScheduleComponent,
    ViewExperimentComponent,
    ExperimentStatusComponent,
    PostExperimentRuleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    HomeRoutingModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatDatepickerModule
  ],
  providers: [],
  entryComponents: [
    NewExperimentComponent,
    ExperimentStatusComponent,
    PostExperimentRuleComponent
  ]
})
export class HomeModule {}
