import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {

  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      hubName: ['', [
        Validators.required
      ]],
      hubDescription: ['', [
        Validators.required
      ]]
    });
  }

  save() {

  }

}
