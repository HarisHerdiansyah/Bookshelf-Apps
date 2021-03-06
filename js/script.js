const listBooks = [];
const render_event = 'render-book-item';
const save_storage_event = 'save-book-item';
const book_storage_key = 'List Book';
const searchBtn = document.getElementById('searchBtn');
const searchBar = document.getElementById('search_bar');
const editBtn = document.getElementById('editBtn');
let temp = null;

document.addEventListener('DOMContentLoaded', function () {
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.addEventListener('click', function (e) {
    Swal.fire(
      'Berhasil ditambahkan!',
      'Data buku telah berhasil ditambahkan.',
      'success'
    );
    
    e.preventDefault();
    addBookItem();
  });

  if (checkStorageBrowser()) {
    renderDataFromStorage();
  }
});

document.addEventListener(render_event, function () {
  const completeBook = document.getElementById('completeBookList');
  const uncompleteBook = document.getElementById('uncompleteBookList');
  completeBook.innerHTML = '';
  uncompleteBook.innerHTML = '';

  for (const bookItem of listBooks) {
    const bookItemElement = createBookItemElement(bookItem);
    if (bookItem.isComplete) {
      completeBook.append(bookItemElement);
    } else {
      uncompleteBook.append(bookItemElement);
    }
  }
});

function generateBookID() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  };
}

function addBookItem() {
  const bookID = generateBookID();
  const titleBook = document.getElementById('title').value;
  const authorBook = document.getElementById('author').value;
  const yearOfBook = document.getElementById('year').value;
  const completeBox = document.getElementById('completeBox').checked;

  const bookItem = generateBookObject(bookID, titleBook, authorBook, yearOfBook, completeBox);
  listBooks.push(bookItem);

  document.dispatchEvent(new Event(render_event));
  saveData();
}

function createBookItemElement({id, title, author, year, isComplete}) {
  const mainCard = document.createElement('div');
  mainCard.classList.add('card', 'my-4');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const titleElement = document.createElement('h4');
  titleElement.innerText = title;
  titleElement.classList.add('mb-3', 'title');

  const authorElement = document.createElement('p');
  authorElement.innerText = `Author : ${author}`;
  authorElement.classList.add('author');

  const yearElement = document.createElement('p');
  yearElement.innerText = `Tahun : ${year}`;
  yearElement.classList.add('year');

  const isCompleteBookStatus = document.createElement('p');

  const showModalEdit = document.createElement('button');
  showModalEdit.innerText = 'Ubah';
  showModalEdit.setAttribute('data-bs-toggle', 'modal');
  showModalEdit.setAttribute('data-bs-target', '#edit-modal');
  showModalEdit.classList.add('btn', 'btn-light', 'float-end');

  const action = document.createElement('div');
  action.classList.add('action', 'mt-4', 'd-flex', 'flex-wrap', 'gap-2');

  const switchBtn = document.createElement('button');

  const deleteBtn = document.createElement('button');
  deleteBtn.innerText = 'Hapus data buku';
  deleteBtn.classList.add('btn', 'btn-danger');

  titleElement.append(showModalEdit);
  action.append(switchBtn, deleteBtn);
  cardBody.append(titleElement, authorElement, yearElement, isCompleteBookStatus, action);
  mainCard.append(cardBody);


  if (isComplete) {
    isCompleteBookStatus.innerText = 'Status : Selesai dibaca';
    switchBtn.innerText = 'Belum selesai dibaca';
    switchBtn.classList.add('btn', 'btn-primary');
    switchBtn.addEventListener('click', function () {
      const bookItemTarget = searchBookItem(id);
      if (bookItemTarget == null) return;

      bookItemTarget.isComplete = false;
      document.dispatchEvent(new Event(render_event));
      saveData();

      Swal.fire(
        'Status buku berubah!',
        'Buku belum selesai dibaca, segera selesaikan bacaan anda!',
        'info'
      );
    });
  } else {
    isCompleteBookStatus.innerText = 'Status : Belum selesai dibaca';
    switchBtn.innerText = 'Selesai dibaca';
    switchBtn.classList.add('btn', 'btn-success');
    switchBtn.addEventListener('click', function () {
      const bookItemTarget = searchBookItem(id);
      if (bookItemTarget == null) return;

      bookItemTarget.isComplete = true;
      document.dispatchEvent(new Event(render_event));
      saveData();

      Swal.fire(
        'Status buku berubah!',
        'Selamat! Buku ini telah selesai dibaca!',
        'success'
      );
    });
  }

  deleteBtn.addEventListener('click', function () {
    const bookItemIndex = searchBookIndex(id);
    if (bookItemIndex == -1) return;

    listBooks.splice(bookItemIndex, 1);
    document.dispatchEvent(new Event(render_event));
    saveData();

    Swal.fire(
      'Data dihapus!',
      'Data buku telah dihapus.',
      'info'
    );
  });

  showModalEdit.addEventListener('click', function () {
    temp = searchBookIndex(id);

    document.getElementById('title-edit').value = listBooks[parseInt(temp)].title;
    document.getElementById('author-edit').value = listBooks[parseInt(temp)].author;
    document.getElementById('year-edit').value = listBooks[parseInt(temp)].year;
  });

  return mainCard;
}

function searchBookItem(bookID) {
  for (const bookItem of listBooks) {
    if (bookItem.id == bookID) {
      return bookItem;
    }
  }

  return null;
}

function searchBookIndex(bookID) {
  for (const i in listBooks) {
    if (listBooks[i].id == bookID) {
      return i;
    }
  }

  return -1;
}

function checkStorageBrowser() {
  if (typeof Storage != undefined) {
    return true;
  }

  return false;
}

function saveData() {
  if (checkStorageBrowser()) {
    const listBooksParse = JSON.stringify(listBooks);
    localStorage.setItem(book_storage_key, listBooksParse);
    document.dispatchEvent(new Event(save_storage_event));
  }
}

function renderDataFromStorage() {
  const getBookData = localStorage.getItem(book_storage_key);
  let dataBook = JSON.parse(getBookData);

  if (dataBook != null) {
    for (const book of dataBook) {
      listBooks.push(book);
    }
  }

  document.dispatchEvent(new Event(render_event));
}

searchBtn.addEventListener('click', function () {
  for (let i = 0; i < listBooks.length; i++) {
    let searchTitle = document.querySelectorAll('.card-body>.title');
    let searchAuthor = document.querySelectorAll('.card-body>.author');
    let searchYear = document.querySelectorAll('.card-body>.year');

    if (searchTitle[i].textContent.includes(searchBar.value) ||
      searchAuthor[i].textContent.includes(searchBar.value) ||
      searchYear[i].textContent.includes(searchBar.value)) {
      document.querySelectorAll('.card')[i].style.display = 'block';
    } else {
      document.querySelectorAll('.card')[i].style.display = 'none';
    }
  }
});

editBtn.addEventListener('click', function () {
  const titleEditValue = document.getElementById('title-edit').value;
  const authorEditValue = document.getElementById('author-edit').value;
  const yearEditValue = document.getElementById('year-edit').value;

  listBooks[parseInt(temp)].title = titleEditValue;
  listBooks[parseInt(temp)].author = authorEditValue;
  listBooks[parseInt(temp)].year = yearEditValue;

  document.dispatchEvent(new Event(render_event));
  saveData();

  Swal.fire(
    'Berhasil diubah!',
    'Data buku telah berhasil diubah.',
    'success'
  );
});