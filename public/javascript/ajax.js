/* global $ */
/* global moment */
// FUZZY SEARCH
$('#search-camps').on('keyup', 'input', function (e) {
   e.preventDefault();
   var form = $(this).parent().parent();
   var formData = form.serialize();
   var formAction = form.attr('action');
   var originalList = form.parent().parent().parent().parent().children("#campgrounds-list").children(".row");
    $.ajax({
      type: "GET",
      url: formAction,
      data: formData,
      success: function(data){
         originalList.html("");
         if(data.flash){
               $("#search-camps").notify(data.flash.msg, {position: "top", className: data.flash.type});
         }else{
         data.campgrounds.forEach(function(camp){
            originalList.append(
               `
                <div class="col-md-3">
                        <div class="card bg-faded">
                                <img class="card-img-top" src="${camp.image}" alt="Card image cap">
                                <div class="card-block">
                                        <h4 class="card-title">${camp.name}</h4>
                                        <a href="/campgrounds/${camp._id}"><button class="btn btn-outline-primary">More info</button></a>
                                </div>
                        </div>
                </div>
               `
               );
         });
         }
      }
    });
});

function formatCamp (camp) {
   if(camp.loading){
      return camp.text;
   }
      var markup = 
      `
      <div class="container row result-camp">
         <div class="col-sm-3">
            <img src="${camp.image}">
         </div>
         <div class="col-sm-9">
            <strong><p>${camp.name} - ${camp.avg_rating} - $${camp.price}</p></strong>
            <p>${camp.location}</p>
         </div>
      </div>
      `;
      return markup;
    }
    
function formatCampSelection (camp) {
      return camp.full_name || camp.text;
    }
   

$("#select_camp").select2({
   allowClear: true,
   placeholder: "Search for a campground...",
  ajax: {
    url: "/campgrounds",
    dataType: 'json',
    delay: 250,
    data: function (params) {
      return {
        search: params.term, // search term
        page: params.page || 1
      };
    },
    processResults: function (data, params) {
       // parse the results into the format expected by Select2
       if(data.flash){
         $("#select_camp").notify(data.flash.msg, {position: "top", className: data.flash.type});
       }else{
       var select2data = $.map(data.campgrounds, function(obj) {
            obj.id = obj.id || obj._id;
            obj.full_name =
            `
            <strong><p>${obj.name} - ${obj.avg_rating} - $${obj.price}</p></strong>
            `;
            obj.text = obj.text || obj.name;
            return obj;
          });
       
      // since we are using custom formatting functions we do not need to
      // alter the remote JSON data, except to indicate that infinite
      // scrolling can be used
      return {
        results: data.campgrounds,
        pagination: {
          more: (params.page * 30) < data.total_count
        }
      };}
    },
    cache: true
  },
  escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
  minimumInputLength: 1,
  templateResult: formatCamp,
  templateSelection: formatCampSelection
}).on('change', function(e){
   console.log($(this).select2("val"));
});

//RATING

$("#rating input").on('click',function(event){
   event.preventDefault();
   var original = $(this).parent().parent().parent().children("#avg_rating");
   var url = window.location.pathname + "/rating";
   var rating = $(this).serialize();
   $.ajax({
      url: url,
      data: rating,
      type: 'PUT',
      originalItem: original,
      success: function(data){
         if(data.redirect){
            window.location.replace(data.redirect);
         }else{
            this.originalItem.html("Average Rating: " + data.camp.avg_rating.toFixed(1));
         }
      }
   });
});

//ADD COMMENT

$("#button_comment-add").on('click',function(event){
   event.preventDefault();
   $("#form_comment-new").slideToggle();
});

$("#form_comment-new").submit(function(event){
   event.preventDefault();     
   var formData = $(this).serialize();
   var formAction = $(this).attr('action');
   $.post(formAction, formData, function(data){
      if(data.redirect){
            window.location.replace(data.redirect);
         }else{
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
            $("#comments-list").notify(data.flash.msg, {position: "top", className: data.flash.type});}
   });
   $(this).slideToggle();
   $(this).find('.form-control').val('');
});

//EDIT COMMENT

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
            if(data.redirect){
            window.location.replace(data.redirect);
         }else{
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
         }}
   });
});

//DELETE COMMENT

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
              if(data.redirect){
            window.location.replace(data.redirect);
         }else{
                   this.itemToDelete.remove();
                     $("#comments-list").notify(data.flash.msg, { position:"top", className: data.flash.type});
           }}
   });
   }
   else{
      $(this).find('button').blur();
   }
});

//LIKE - DISLIKE COMMENT

$("#comments-list").on('click','.button-like',function(e){
   e.preventDefault();
   var cardBlock = $(this).parent();
   var formAction  = $(this).parent().parent('.card').find(".form_comment-edit").attr("action") + "/like";
   $.ajax({
      url: formAction,
      type: 'PUT',
      originalItem: cardBlock,
      success: function(data){
         if(data.redirect){
            window.location.replace(data.redirect);
         }else{console.log(data);
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
            `);}
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
         if(data.redirect){
            window.location.replace(data.redirect);
         }else{
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
      }}
   });
});