/* global $ */
/* global moment */

$("#button_comment-add").on('click',function(event){
   event.preventDefault();
   $("#form_comment-new").slideToggle();
});

$("#form_comment-new").submit(function(event){
   event.preventDefault();     
   var formData = $(this).serialize();
   var formAction = $(this).attr('action');
   var aFormAction = formAction.split('/');
   $.post(formAction, formData, function(data){
           $("#comments-list").prepend(
               `
               <div class="row">
                       <div class="col-md-12">
                               <div class="card">
                                       <div class="card-block">
                                               <span><small class="text-muted pull-right"><i class="fa fa-clock-o" aria-hidden="true"></i>&nbsp;${moment(data.date).fromNow()}</small>
                                               <span class="card-title"><strong><a href="/profile/${data.author.id}"><img style="max-width: 32px; border-radius: 50%;" src="${data.author.image}" alt="Author profile image">&nbsp;${data.author.username}</a></strong></span></span>
                                               <p class="card-text">${data.text}</p>
                                               <form class="form_comment-delete" action="/campgrounds/${aFormAction[2]}/comments/${data._id}" method="POST">
                                                      <button class="btn btn-sm btn-danger pull-right">Delete</button>
                                                </form>
                                                <button class="btn btn-sm btn-warning pull-right button-edit">Edit</button>
                                       </div>
                                       <div class="container">
                                               <form class="form_comment-edit" action="/campgrounds/${aFormAction[2]}/comments/${data._id}" method="post">
                                                       <div class="form-group row">
                                                             <div class="col-sm-12">
                                                               <textarea type="text" class="form-control" id="inputCommentText" name="comment[text]">${data.text}</textarea>
                                                             </div>
                                                       </div>
                                                       <div class="form-group">
                                                       <button type="submit" class="btn btn-success btn-block">Update</button>
                                                       </div>
                                               </form>
                                        </div>
                               </div>
                       </div>
               </div>
               `
            );
   });
   $(this).slideToggle();
   $(this).find('.form-control').val('');
});

$("#comments-list").on('click', '.button-edit', function(){
        alert("edit clicked");
   $(this).parent().parent().find('.form_comment-edit').slideToggle();
});

$("#comments-list").on('submit','.form_comment-edit',function(e){
   e.preventDefault();
   var commentItem = $(this).serialize();
   var formAction = $(this).attr('action');
   var aFormAction = formAction.split('/');
   var original = $(this).parent().parent('.card').children(".card-block");
   var form_edit = $(this);
   var button = "";
   $.ajax({
         url: formAction,
         data: commentItem,
         type: 'PUT',
         originalItem: original,
         success: function(data){
            console.log(data);
            this.originalItem.html(
               `
                <span><small class="text-muted pull-right"><i class="fa fa-clock-o" aria-hidden="true"></i>&nbsp;${moment(data.date).fromNow()}</small>
                <span class="card-title"><strong><a href="/profile/${data.author.id}"><img style="max-width: 32px; border-radius: 50%;" src="${data.author.image}" alt="Author profile image">&nbsp;${data.author.username}</a></strong></span></span>
                <p class="card-text">${data.text}</p>
                <form class="form_comment-delete" action="/campgrounds/${aFormAction[2]}/comments/${data._id}" method="POST">
                      <button class="btn btn-sm btn-danger pull-right">Delete</button>
                </form>
                <button class="btn btn-sm btn-warning pull-right button-edit">Edit</button>
               `
               );
               form_edit.slideToggle();
         }
   });
});

$("#comments-list").on('submit', '.form_comment-delete', function(event){
   event.preventDefault();
   var confirmResponse = confirm("Are you sure?");
   if(confirmResponse){
      var formAction = $(this).attr('action');
      var itemToDelete = $(this).closest('.row');
       $.ajax({
           url: formAction,
           type: 'DELETE',
           itemToDelete: itemToDelete,
           success: function(data){
                   this.itemToDelete.remove();
           }
   });
   }
   else{
      $(this).find('button').blur();
   }
});