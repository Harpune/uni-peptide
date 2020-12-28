import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-institute-details',
  templateUrl: './institute-details.component.html',
  styleUrls: ['./institute-details.component.scss']
})
export class InstituteDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    console.log('id', id)
  }

}
