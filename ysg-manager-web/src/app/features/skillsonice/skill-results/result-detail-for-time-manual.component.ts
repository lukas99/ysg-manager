import { Component, OnInit } from '@angular/core';
import { ResultDetailModel } from './result-detail.model';

@Component({
  selector: 'ysg-result-detail-for-time-manual',
  templateUrl: './result-detail-for-time-manual.component.html',
  styleUrls: ['./result-detail-for-time-manual.component.css']
})
export class ResultDetailForTimeManualComponent
  extends ResultDetailModel
  implements OnInit
{
  resultExists(): boolean {
    // all values of selected item are undefined, we use time here for testing
    return this.skillResultsService.getSelectedItemValue().time;
  }
}
