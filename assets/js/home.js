$(function () {
	let selectedItems = [];

	function checkboxAction(id){
		console.log(id);
		$(`#todo-details-${id} div`).toggleClass("skriked");
		$(`#todo-details-${id}-wrapper`).toggleClass("bg-select text-select");
		console.log($(`#${id}`)[0])
		if ($(`#${id}`)[0].checked) {
			if(selectedItems.indexOf(id) < 0) selectedItems = [...selectedItems, id];
		} else {
			selectedItems = selectedItems.filter(item => item !== id)
		}
		console.log(selectedItems)

	}

	function handleCheckbox(e) {
		const checkboxId = e.target.id;
		// $(`#${checkboxId}`).prop('checked', !$(`#${checkboxId}`)[0].checked);
		checkboxAction(checkboxId);
	}

	function handleTodoRowClick(e){
		console.log(e)
		if (e.target.type == 'checkbox') return;		
		console.log(e.currentTarget.className)
		if(e.currentTarget.classList.contains("todo-item-wrapper")){
			const checkboxId = e.currentTarget.attributes['data-todo-id'].value;
			$(`#${checkboxId}`).prop('checked', !$(`#${checkboxId}`)[0].checked)
			checkboxAction(checkboxId);	
		}
	}

	console.log("Document Ready");

	$('#due-date-input').datepicker({ dateFormat: 'dd MM, yy' });

	$('#create-todo-form').submit((e) => { e.preventDefault() })

	$('#add-task').click((e) => {
		let formData = $('#create-todo-form').serializeArray();
		console.log("Add Task", formData);

		let data = {};
		formData.forEach(item => data[item.name] = item.value)
		console.log(data);

		let title = $("#title-input").val() || '';
		let desc = $("#desc-input").val() || '';
		let category = $("#category-input").val() || '';
		let dueDate = $("#due-date-input").val() || '';

		console.log(title, desc, category, dueDate);
		
		$(".error").remove();
		// return;
		let element = '<span class="error">This field is required</span>';
		if (title.length < 1) {
			$('#title-input').after(element);
			$("#title-input").focus()
			console.log(title)
			return;
		}
		if (desc.length < 1) {
			$('#desc-input').after(element);
			$("#desc-input").focus()
			console.log(desc)
			return;
		}
		if (category.length < 1) {
			$('#category-input').after(element);
			$("#category-input").focus()
			console.log(category)
			return;
		}
		if (dueDate.length < 1) {
			$('#due-date-input').after(element);
			$("#due-date-input").focus()
			console.log(dueDate)
			return;
		}


		$.ajax('/todos', {
			method: 'POST',
			data: { todo: JSON.stringify(data) }
		})
			.done((data) => {
				console.log("Todo Added!");
				window.location = '/';
			})
	})

	$('.todo-item-checkbox').each(function () {
		$(this).change(handleCheckbox);
	})
	$('.todo-item-wrapper').each(function () {
		$(this).click(handleTodoRowClick);
	})
	$('#delete-tasks').click(function () {
		let data = JSON.stringify(selectedItems)
		$.ajax('/todos', {
			method: 'DELETE',
			data: { ids: data }
		})
			.done((data) => {
				window.location = '/';
			})
	})
});

