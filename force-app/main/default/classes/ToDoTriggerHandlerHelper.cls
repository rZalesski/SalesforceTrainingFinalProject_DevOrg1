public with sharing class ToDoTriggerHandlerHelper {
   @future(callout = true)
   public static void handleAfterInsert_future(Set<Id> ids){
       //change to something better
       Map<Id, ToDo__c> todosMap = new Map<Id, ToDo__c>([
           SELECT Name, Description__c, Is_Done__c, Priority__c, 
           Image_URL__c, Connected_Org_Record_Id__c
           FROM ToDo__c
           WHERE Id IN : ids
        ]);
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:devorg_2_credential/services/apexrest/todoapi/');
        req.setMethod('POST');
        req.setHeader('Content-type', 'application/json;charset=UTF-8');
        req.setBody(JSON.serialize(todosMap.values()));
        Http http = new Http();
        HttpResponse resp = http.send(req);
        List<ToDo__c> syncedTodos = 
        (List<ToDo__c>)JSON.deserialize(resp.getBody(), List<ToDo__c>.class);
        for(ToDo__c todo : syncedTodos){
            todosMap.get(todo.Connected_Org_Record_Id__c).
            Connected_Org_Record_Id__c = todo.Id;
        }
        update todosMap.values();
   } 
   @future(callout = true)
   public static void handleAfterUpdate_future(Set<Id> ids){
       List<ToDo__c> todos = [
            SELECT Name, Description__c, Is_Done__c, Priority__c, 
            Image_URL__c, Connected_Org_Record_Id__c
            FROM ToDo__c
            WHERE Id IN : ids
       ];
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:devorg_2_credential/services/apexrest/todoapi/');
        req.setMethod('PATCH');
        req.setHeader('Content-type', 'application/json;charset=UTF-8');
        req.setBody(JSON.serialize(todos));
        Http http = new Http();
        HttpResponse resp = http.send(req);
   } 
   @future(callout = true)
   public static void handleBeforeDelete_future(Set<Id> ids){
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:devorg_2_credential/services/apexrest/todoapi/');
        req.setMethod('DELETE');
        req.setHeader('Content-type', 'application/json;charset=UTF-8');
        req.setBody(JSON.serialize(ids));
        Http http = new Http();
        HttpResponse resp = http.send(req);
   } 
}