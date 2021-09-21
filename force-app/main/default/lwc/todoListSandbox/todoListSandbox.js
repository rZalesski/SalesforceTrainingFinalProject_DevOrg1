import {LightningElement, track, wire} from 'lwc';
import getAllTodosWithSubTodos from '@salesforce/apex/ToDoHandler.findTodosWithSubTodos';
import {refreshApex} from '@salesforce/apex'

export default class TodoListSandbox extends LightningElement {

    nameKey = '';
    priorityKey = '';
    startDateKey = '';
    endDateKey = '';


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
    @wire(getAllTodosWithSubTodos, {
            priorityKey: '$priorityKey',
            nameKey: '$nameKey',
            startDateKey: '$startDateKey',
            endDateKey: '$endDateKey',
    })
    getTodos(result){
        this.res = result;
        if(result.data){
            this.todos = result.data;
            this.countProgress();
        }
    }

    getname(event){
        this.nameKey = event.target.value;
    }

    getpriority(event){
        this.priorityKey = event.target.value;
    }

    getdate(event){
        this.endDateKey = event.target.value;
        this.startDateKey = event.target.value;
    }

    key(){
        this.nameFKey = this.nameKey;
        this.priorityFKey = this.priorityKey;
        this.startDateFKey = this.startDateKey;
        this.endDateFKey = this.endDateKey;
    }

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