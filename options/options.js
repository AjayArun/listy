
//button actions
(function () {

	/*userObj = UserManager.getInstance();
	console.log("check : " + userObj.getUserList());
	userList = userObj.getUserList();
	console.log("user list : " + userList);*/
	userObj = UserManager.getInstance();
    selectedUser = userObj.getAUser();
	$(window).load(function(){
		render(window.location.hash);
	});

	$(window).on('hashchange', function(){
		// console.log("check : " + window.location.hash);
		render(window.location.hash);
	});

	$("body").on("click", ".logout", function() {
		// console.log("logout click action");
		userObj.removeUser(this.id);
		window.open(window.location.origin + "/options/index.html", "_self");
	});

	$("body").on("click", ".list-user", function() {
		// console.log("id" + this.id);
		selectedUser = userObj.getUserObj(this.id);
		lists = twitter_urlcall.tUrlCaller(selectedUser, "https://api.twitter.com/1.1/lists/list.json", "GET", {"user_id" : selectedUser.user_id});
		// console.log(" lists : " + JSON.stringify(lists));
		$("[id=list-lists]").html(Handlebars.templates["list-lists-template.handlebarse"](lists))
	});

	$("body").on("click", ".list-list", function() {
		listusers = twitter_urlcall.tUrlCaller(selectedUser, "https://api.twitter.com/1.1/lists/members.json", "GET", {"slug" : $(this).attr("slug"),"owner_id" : selectedUser.user_id});
		//console.log(JSON.stringify(listusers.users));
		$("[id=lists-users]").html(Handlebars.templates["list-users-template.handlebarse"](listusers.users))
		$("[id=lists-users]").attr("list_id",this.id);
	});

	$("body").on("click", ".delete-list", function(event){
		event.stopPropagation();
		var returnObj = twitter_urlcall.tUrlCaller(selectedUser, "https://api.twitter.com/1.1/lists/destroy.json", "POST", {"slug" : $(this).parent().attr("slug"),"list_id" : this.parentElement.id });
		if($("#lists-users").attr("list_id") == this.parentElement.id){	$("#lists-users").empty();	}
		this.parentElement.remove();
	});

	$("body").on("click", ".delete-user", function(event){
		event.stopPropagation();
		var returnObj = twitter_urlcall.tUrlCaller(selectedUser, "https://api.twitter.com/1.1/lists/members/destroy_all.json", "POST", {"user_id" : $(this).parents("div.lists-user").attr("id"),"list_id" : $(this).parents("div.lists-users").attr("list_id") });
		$(this).parents('div.lists-user').remove();
	});

	function renderAccountsPage(account) {
		$("#accountList").html("");
        $("[id=accountList]").html(Handlebars.templates["account-template.handlebarse"](account));
	}

    function renderListPage(user) {
    	userList = userObj.getUserList();
    	$("[id=list-users]").html(Handlebars.templates["list-user-template.handlebarse"](userList));
    	lists = twitter_urlcall.tUrlCaller(user, "https://api.twitter.com/1.1/lists/list.json", "GET", {"user_id" : user.user_id});
		$("[id=list-lists]").html(Handlebars.templates["list-lists-template.handlebarse"](lists))
    }

	$("[id=addNewButton]").click(function() {
		requestTokenObj = twitter_urlcall.request_token();
		window.open("https://api.twitter.com/oauth/authorize?oauth_token="+requestTokenObj.oauth_token, "_self");
	});

	function render(url) {

		// Get the keyword from the url.
		var temp = url.split('/')[0];

		// Hide whatever page is currently shown.
		$('.main-content .page').removeClass('visible');


		var	map = {

			// The "Homepage".
			'': function() {

					$("[id=lists]").removeClass('navbar-item navbar-item-selected').addClass('navbar-item');
					$("[id=about]").removeClass('navbar-item navbar-item-selected').addClass('navbar-item');
					$("[id=accounts]").addClass('navbar-item navbar-item-selected');
					$("#accounts-page").show();
					$("#list").hide();
					$("#aboutit").hide();

				    if (window.location.search.slice(1)) {
				    	data = twitter_urlcall.access_Token(twitter_urlcall.t_response_to_json(window.location.search.slice(1)));
				    	// console.log(":)) " + JSON.stringify(data));
				    	userObj.addUser(data);
				    	window.open(window.location.origin + "/options/index.html", "_self");
				    }

				    // console.log("routing works check");
					userList = userObj.getUserList();
					// console.log("routing works userList : " + JSON.stringify(userList));
					if(userList) {
					if(userList.length > 0) {
						renderAccountsPage(userList);
					}
					else {
						// console.log("else part");
						$("#accountList").html('<div class="account"><span><h3>No accounts connected</h3></span></div>')
					}
					}
			},

			// Single Products page.
			'#list': function() {
				$("[id=accounts]").removeClass('navbar-item navbar-item-selected').addClass('navbar-item');
				$("[id=about]").removeClass('navbar-item navbar-item-selected').addClass('navbar-item');
				$("[id=lists]").addClass('navbar-item navbar-item-selected');
				$("#accounts-page").hide();
				$("#aboutit").hide();
				$("#list").show();
				if (selectedUser) {
					renderListPage(selectedUser);
				}
			},

			// Page with filtered products
			'#about': function() {
				$("[id=accounts]").removeClass('navbar-item navbar-item-selected').addClass('navbar-item');
				$("[id=lists]").removeClass('navbar-item navbar-item-selected').addClass('navbar-item');
				$("[id=about]").addClass('navbar-item navbar-item-selected');
				$("#accounts-page").hide();
				$("#list").hide();
				$("#aboutit").show();
			}
		};

		// Execute the needed function depending on the url keyword (stored in temp).
		if(map[temp]){
			map[temp]();
		}
		// If the keyword isn't listed in the above - render the error page.
		else {
			renderErrorPage();
		}
	}

})();
