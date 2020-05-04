import { Component, OnInit,Input, ViewChild,Inject } from '@angular/core';
import {Params, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {Dish} from '../shared/dish';
import {Comment} from '../shared/comment';
import {DishService} from '../services/dish.service';
import {switchMap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  newCommentForm: FormGroup;
  newComment: Comment;

  @ViewChild('fform') CommentFormDirective;

  formErrors = {
    author: '',
    rating: 5,
    comment: ''
  };

  validationMessages = {
    'author': {
      'required': 'Author name is required.',
      'minlength': 'Author must be atleast 2 characters long'
    },
    'comment': {
      'required': 'Comment is required.',
    }
    
  };
  
  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL) {
      this.createForm();
     }

  createForm():void {
    this.newCommentForm = this.fb.group({
      author: ['',[Validators.required,Validators.minLength(2)]],
      rating: [5,Validators.required],
      comment: ['',Validators.required]
    });
    
    this.newCommentForm.valueChanges.subscribe(data => this.onValueChanged(data));
    
    this.onValueChanged(); // reset form validation messages
  }

  onSubmit(){
    this.newComment = this.newCommentForm.value;
    console.log(this.newComment);
    this.newComment.date = this.retDate();
    this.dish.comments.push(this.newComment)
    this.CommentFormDirective.resetForm();
    this.newCommentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });
    
  }

  retDate(): string{
    let d = new Date();
    const dt  = d.toISOString();
    return dt;
  }

  ngOnInit(): void {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    let id = this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
    .subscribe(dish =>{this.dish = dish; this.setPrevNext(this.dish.id)});
    
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev  = this.dishIds[(index-1+this.dishIds.length)% this.dishIds.length];
    this.next = this.dishIds[(index+1+this.dishIds.length)%this.dishIds.length];
  }

  goBack(): void{
    this.location.back();
  }

  onValueChanged(data?: any) {
    if(!this.newCommentForm) {return; }
    const form = this.newCommentForm;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        //clear previous error message (if any)
        this.formErrors[field]  = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field]+= messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  formatLabel(value: number) {
    return value;
  }

  getCommentValue(attr: string): any{
   const val =  this.newCommentForm.get(attr);
   return val.value;
  }

}
