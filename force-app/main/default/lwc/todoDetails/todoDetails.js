import { LightningElement, api, wire, track } from 'lwc';
import getSubtodosOfTodo from '@salesforce/apex/SubToDoHandler.getSubToDosOfTodo';
import getTodo from '@salesforce/apex/ToDoHandler.getTodoById';
import { subscribe, MessageContext } from 'lightning/messageService';
import TODO_SELECTED_CHANNEL from '@salesforce/messageChannel/Todo_Selected__c';


export default class TodoDetails extends LightningElement {
    todo = '';
    selectedTodoId = '';//получается из message channel
    subscribtion = null;
    subtodos = '';
    error;
    @wire(MessageContext)
    messageContext;

    /*@wire(getTodo, { selectedTodoId: '$todoId'})
    getTodo(result){
        this.res = result;
        console.log(result.data);
        if(result.data){
            this.todo = result.data;
        }
    }*/

   /* @wire(getSubtodosOfTodo, {selectedTodoId : '$todoId'}) 
    getSubTodos(result){
        this.res = result;
        if(result.data){
           this.subtodos = result.data;
        }
    }*/

    subscribeToMessageChannel(){
        this.subscribtion = subscribe(
            this.messageContext,
            TODO_SELECTED_CHANNEL,
            (message)=>this.handleMessage(message)
        );
    }

    handleMessage(message){
        this.selectedTodoId = message.selectedTodoId;
        if(this.selectedTodoId != ''){
            getTodo({ selectedTodoId: '$todoId'})
            .then(result => {
                this.todo = result;
                console.log(result);   
            })
            .catch(error => {
                this.error = error;
            });

        }
    }

    connectedCallback(){
        this.subscribeToMessageChannel();
    }

    get isSubTodosEmpty(){
        return this.subtodos == '' ? true : false;
    }

    get isTodoEmpty(){
        return this.todo == '' ? true : false;
    }

   

    

}