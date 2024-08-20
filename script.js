class ItemService {
  static url = "https://66c100faba6f27ca9a581c47.mockapi.io/item";

  static getAllItems() {
    return $.get(this.url);
  }

  static getItem(id) {
    return $.get(this.url + `/${id}`);
  }

  static createItem(item) {
    return $.post(this.url, item);
  }

  static updateItem(item) {
    return $.ajax({
      url: this.url + `/${item._id}`,
      dataType: "json",
      data: JSON.stringify(item),
      contentType: "application/json",
      type: "PUT",
    });
  }

  static deleteItem(id) {
    console.log("Deleting item with id:", id); // Debugging line
    return $.ajax({
      url: this.url + `/${id}`,
      type: "DELETE",
    });
  }
}

class Item {
  constructor(item) {
    this.item = item;
    this.rooms = [];
  }
}

class DOMManager {
  static getAllItems() {
    ItemService.getAllItems()
      .then((items) => this.render(items))
      .catch((error) => console.error("Error fetching items:", error));
  }

  static render(items) {
    $("#app").empty();
    for (let item of items) {
      $("#app").prepend(
        `
        <div id="${item.id}" class="card m-1">
          <div class="card-header">
            <h2>${item.item} <button class="remove float-md-end bg-success-subtle text-success btn btn-info" data-id="${item.id}" type="button"> Remove </button> </h2>
          </div>
        </div>
        `
      );
    }

    // Attach the event listener to the remove button after rendering
    $(".remove").click(function() {
      const id = $(this).data("id");
      DOMManager.deleteItem(id); // Call the deleteItem method with the item's id
    });
  }

  static deleteItem(id) {
    ItemService.deleteItem(id)
      .then(() => {
        this.getAllItems(); // Refresh the list after deletion
      })
      .catch((error) => console.error("Error deleting item:", error));
  }
}

// Initialize and load items when the page loads
DOMManager.getAllItems();

// Event listener for creating a new item
$("#create-new-item").click(() => {
  const name = $("#new-character-name").val();
  const item = new Item(name);
  ItemService.createItem(item)
    .then(() => {
      DOMManager.getAllItems(); // Refresh the list after creating a new item
    })
    .catch((error) => console.error("Error creating item:", error));
});
