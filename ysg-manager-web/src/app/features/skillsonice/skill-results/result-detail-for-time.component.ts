import { Component, OnInit } from '@angular/core';
import { ResultDetailModel } from './result-detail.model';

@Component({
  selector: 'ysg-result-detail-for-time',
  templateUrl: './result-detail-for-time.component.html',
  styleUrls: ['./result-detail-for-time.component.css']
})
export class ResultDetailForTimeComponent
  extends ResultDetailModel
  implements OnInit
{
  shouldUpdate(): boolean {
    // all values of selected item are undefined, we use time here for testing
    return this.skillResultsService.getSelectedItemValue().time;
  }
}