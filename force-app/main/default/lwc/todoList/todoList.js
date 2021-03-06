import { LightningElement, track, wire } from 'lwc';
import getAllTodosWithSubTodos from '@salesforce/apex/ToDoHandler.getAllTodosWithSubTodos';
import {refreshApex} from '@salesforce/apex';

import findTodosWithSubTodos from '@salesforce/apex/ToDoHandler.findTodosWithSubTodos';//

export default class TodoList extends LightningElement {
    showsearchtools = false;

    priorityKey='';
    nameKey='';
    startDateKey = '';
    endDateKey = '';

    @wire(findTodosWithSubTodos,{
        priorityKey:'$priorityKey',
        nameKey:'$nameKey',
        startDateKey:'$startDateKey',
        endDateKey:'$endDateKey'
    })
    getTodos(result){
        this.res = result;
        if(result.data){
            this.todos = result.data;
            this.countProgress();
        }
    }

    handleShowSearchTools(){
        this.showsearchtools = !this.showsearchtools;
    }
    handleKeyChange(event){
        this.nameKey = event.detail.nameKey;
        this.priorityKey = event.detail.priorityKey;
        this.startDateKey = event.detail.startDateKey;
        this.endDateKey = event.detail.endDateKey;
    }
    handleResetData(event){
        this.nameKey = event.detail.nameKey;
        this.priorityKey = event.detail.priorityKey;
        this.startDateKey = event.detail.startDateKey;
        this.endDateKey = event.detail.endDateKey;
    }
    connectedCallback() {
        this.startDateKey = '2000-01-01T00:00:00Z';
        const today = new Date();
        this.endDateKey=today.toISOString();
    }



    showsubtodos = false;
    todos;
    res;
    progress = 0;
    isdisabled = false;
    creationModalOpened = false;
    recordTypeModalOpened = false;

    recordTypeId = '0125g000001qnSTAAY';
    get recordTypeOptions(){
        return [
            {label:'Development', value:'0125g000001qnSTAAY'},
            {label:'Administration', value:'0125g000001qnSYAAY'},
            {label:'Management', value:'0125g000001qnSdAAI'}
        ];
    }
    // @wire(getAllTodosWithSubTodos)
    // getTodos(result){
    //     this.res = result;
    //     if(result.data){
    //         this.todos = result.data;
    //         this.countProgress();
    //     }
    // }
    renderedCallback(){
        this.refresh();
    }
    refresh(){
        refreshApex(this.res);
    }
    enableBtns(){
        this.isdisabled = false;
    }
    disableBtns(){
        this.isdisabled = true;
    }
    countProgress(){
        let todosCount = 0;
        let todosDone = 0;
        this.todos.forEach(element => {
            if(element.SubToDos__r){
                element.SubToDos__r.forEach(element=>{
                    todosCount++;
                    todosDone += element.Is_Done__c ? 1 : 0;
                });
            } else {
                todosCount++;
                todosDone += element.Is_Done__c ? 1 : 0; 
            }
        });
        this.progress = (todosDone/todosCount) * 100;
    }
    closeRecordTypeModal(){
        this.recordTypeModalOpened = false;
    }
    openRecordTypeModal(){
        this.recordTypeModalOpened = true;
    }
    openCreationModal(){
        this.recordTypeModalOpened = false;
        this.creationModalOpened = true;
    }
    closeCreationModal(){
        this.creationModalOpened = false;
        this.refresh();
    }
    changeRecordTypeId(event){
        this.recordTypeId = event.target.value;
    }
    handleShowSubtodos(){
        this.showsubtodos = !this.showsubtodos;
    }
}