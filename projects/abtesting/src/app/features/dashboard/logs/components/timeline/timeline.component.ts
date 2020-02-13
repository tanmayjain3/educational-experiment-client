import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { LogType, EXPERIMENT_LOG_TYPE } from '../../../../../core/logs/store/logs.model';
import * as Convert from 'ansi-to-html';

@Component({
  selector: 'logs-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent {
  @Input() logData;
  @Input() logType: LogType;

  get LogType() {
    return LogType;
  }

  get ExperimentLogType() {
    return EXPERIMENT_LOG_TYPE;
  }

  getHtmlFormedLogData(id: string, diff) {
    const convert = new Convert();
    let convertedToHtml = convert.toHtml(diff);
    convertedToHtml = convertedToHtml.split('color:#FFF').join('color: grey');
    const diffNode = document.getElementById(id);
    const html = new DOMParser().parseFromString(convertedToHtml, 'text/html');
    if (diffNode) {
      diffNode.innerHTML = html.body.innerHTML;
    }
  }
}
