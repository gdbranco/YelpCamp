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
   $.post(formAction, formData, function(data){
           $("#comments-list").prepend(
               `
               <div class="row">
                       <div class="col-md-12">
                               <div class="card">
                                       <div class="card-block">
                                               <span><small class="text-muted pull-right"><i class="fa fa-clock-o" aria-hidden="true"></i>&nbsp;${moment(data.comment.date).fromNow()}</small>
                                               <span class="card-title"><strong><a href="/profile/${data.comment.author.id}"><img style="max-width: 32px; border-radius: 50%;" src="${data.comment.author.image}" alt="Author profile image">&nbsp;${data.comment.author.username}</a></strong></span></span>
                                               &nbsp;&nbsp;<span class="button-like">${data.comment.qtd_likes}&nbsp;<i class="fa fa-thumbs-o-up" aria-hidden="true"></i></span>
                                               <p class="card-text">${data.comment.text}</p>
                                               <form class="form_comment-delete" action="/campgrounds/${data.camp._id}/comments/${data.comment._id}" method="POST">
                                                      <button class="btn btn-sm btn-danger pull-right">Delete</button>
                                                </form>
                                                <button class="btn btn-sm btn-warning pull-right button-edit">Edit</button>
                                       </div>
                                       <div class="container">
                                               <form class="form_comment-edit" action="/campgrounds/${data.camp._id}/comments/${data.comment._id}" method="post">
                                                       <div class="form-group row">
                                                             <div class="col-sm-12">
                                                               <textarea type="text" class="form-control" id="inputCommentText" name="comment[text]">${data.comment.text}</textarea>
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
            $("#comments-list").notify(data.flash.msg, {position: "top", className: data.flash.type});
   });
   $(this).slideToggle();
   $(this).find('.form-control').val('');
});

$("#comments-list").on('click', '.button-edit', function(){
   $(this).parent().parent().find('.form_comment-edit').slideToggle();
});

$("#comments-list").on('submit','.form_comment-edit',function(e){
   e.preventDefault();
   var commentItem = $(this).serialize();
   var formAction = $(this).attr('action');
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
                <span><small class="text-muted pull-right"><i class="fa fa-clock-o" aria-hidden="true"></i>&nbsp;${moment(data.comment.date).fromNow()}</small>
                <span class="card-title"><strong><a href="/profile/${data.comment.author.id}"><img style="max-width: 32px; border-radius: 50%;" src="${data.comment.author.image}" alt="Author profile image">&nbsp;${data.comment.author.username}</a></strong></span></span>
                &nbsp;&nbsp;<span class="button-like">${data.comment.qtd_likes}&nbsp;<i class="fa fa-thumbs-o-up" aria-hidden="true"></i></span>
                <p class="card-text">${data.comment.text}</p>
                <form class="form_comment-delete" action="/campgrounds/${data.camp_id}/comments/${data.comment._id}" method="POST">
                      <button class="btn btn-sm btn-danger pull-right">Delete</button>
                </form>
                <button class="btn btn-sm btn-warning pull-right button-edit">Edit</button>
               `
               );
               original.notify(data.flash.msg, {position: "top", className: data.flash.type});
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
                     $("#comments-list").notify(data.flash.msg, { position:"top", className: data.flash.type});
           }
   });
   }
   else{
      $(this).find('button').blur();
   }
});

$("#comments-list").on('click','.button-like',function(e){
   e.preventDefault();
   var cardBlock = $(this).parent();
   var formAction  = $(this).parent().parent('.card').find(".form_comment-edit").attr("action") + "/like";
   $.ajax({
      url: formAction,
      type: 'PUT',
      originalItem: cardBlock,
      success: function(data){
         console.log(data);
         this.originalItem.html(
            `
             <span><small class="text-muted pull-right"><i class="fa fa-clock-o" aria-hidden="true"></i>&nbsp;${moment(data.comment.date).fromNow()}</small>
             <span class="card-title"><strong><a href="/profile/${data.comment.author.id}">
             <img style="max-width: 32px; border-radius: 50%;" src="${data.comment.author.image}" alt="Author profile image">&nbsp;${data.comment.author.username}</a></strong></span></span>
             &nbsp;&nbsp;<span class="button-dislike">${data.comment.qtd_likes}&nbsp;<i class="fa fa-thumbs-o-down" aria-hidden="true"></i></span>
             <p class="card-text">${data.comment.text}</p>
             <form class="form_comment-delete" action="/campgrounds/${data.camp_id}/comments/${data.comment._id}" method="POST">
                   <button class="btn btn-sm btn-danger pull-right">Delete</button>
             </form>
             <button class="btn btn-sm btn-warning pull-right button-edit">Edit</button>
            `);
      }
   });
});

$("#comments-list").on('click','.button-dislike',function(e){
   e.preventDefault();
   var cardBlock = $(this).parent();
   var formAction  = $(this).parent().parent('.card').find(".form_comment-edit").attr("action") + "/dislike";
   $.ajax({
      url: formAction,
      type: 'PUT',
      originalItem: cardBlock,
      success: function(data){
         console.log(data);
         this.originalItem.html(
            `
             <span><small class="text-muted pull-right"><i class="fa fa-clock-o" aria-hidden="true"></i>&nbsp;${moment(data.comment.date).fromNow()}</small>
             <span class="card-title"><strong><a href="/profile/${data.comment.author.id}">
             <img style="max-width: 32px; border-radius: 50%;" src="${data.comment.author.image}" alt="Author profile image">&nbsp;${data.comment.author.username}</a></strong></span></span>
             &nbsp;&nbsp;<span class="button-like">${data.comment.qtd_likes}&nbsp;<i class="fa fa-thumbs-o-up" aria-hidden="true"></i></span>
             <p class="card-text">${data.comment.text}</p>
             <form class="form_comment-delete" action="/campgrounds/${data.camp_id}/comments/${data.comment._id}" method="POST">
                   <button class="btn btn-sm btn-danger pull-right">Delete</button>
             </form>
             <button class="btn btn-sm btn-warning pull-right button-edit">Edit</button>
            `);
      }
   });
});