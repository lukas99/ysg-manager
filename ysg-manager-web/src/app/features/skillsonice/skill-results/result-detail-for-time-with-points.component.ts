import { Component, OnInit } from '@angular/core';
import { ResultDetailModel } from './result-detail.model';

@Component({
  selector: 'ysg-result-detail-for-time-with-points',
  templateUrl: './result-detail-for-time-with-points.component.html',
  styleUrls: ['./result-detail-for-time-with-points.component.css']
})
export class ResultDetailForTimeWithPointsComponent
  extends ResultDetailModel
  implements OnInit
{
  shouldUpdate(): boolean {
    // all values of selected item are undefined, we use time here for testing
    return this.skillResultsService.getSelectedItemValue().time;
  }
}
