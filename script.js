const bookArrayList = [];

function generateBookID() {
  return +new Date();
}

function bookObjectTemplate(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  };
}

function createHTMLBookObject({ title, author, year, isComplete }) {
  const completeBook = document.getElementById('completeBookList');
  const uncompleteBook = document.getElementById('uncompleteBookList');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');

  const titleBookElement = document.createElement('h4');
  titleBookElement.innerText = title;

  const authorBookElement = document.createElement('p');
  authorBookElement.innerText = `Author : ${author}`;

  const yearOfBookElement = document.createElement('p');
  yearOfBookElement.innerText = `Tahun : ${year}`;

  const isCompleteBookStatus = document.createElement('p');

  const action = document.createElement('div');
  const switchBtn = document.createElement('button');
  const deleteBtn = document.createElement('button');

  card.classList.add('card', 'my-4');
  cardBody.classList.add('card-body')
  action.classList.add('action');
  action.append(switchBtn, deleteBtn);
  cardBody.append(titleBookElement, authorBookElement, yearOfBookElement, isCompleteBookStatus, action);
  card.appendChild(cardBody);

  if (isComplete) {
    isCompleteBookStatus.innerText = 'Status : Selesai dibaca';
    switchBtn.innerText = 'Belum selesai dibaca';
    switchBtn.classList.add('btn', 'btn-primary', 'mt-4');
    switchBtn.addEventListener('click', function() {
      alert('belum selesai dibaca');
    });
    completeBook.appendChild(card);
  } else {
    isCompleteBookStatus.innerText = 'Status : Belum selesai dibaca';
    switchBtn.innerText = 'Selesai dibaca';
    switchBtn.classList.add('btn', 'btn-success', 'mt-4');
    switchBtn.addEventListener('click', function() {
      alert('selesai dibaca');
    });
    uncompleteBook.appendChild(card);
  }

  deleteBtn.classList.add('btn', 'btn-danger', 'mt-4', 'ms-2');
  deleteBtn.innerText = 'Hapus data buku';
  deleteBtn.addEventListener('click', function() {
    alert('tombol delete di klik');
  });
}

const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', function () {
  const bookID = generateBookID();
  const titleBook = document.getElementById('title').value;
  const authorBook = document.getElementById('author').value;
  const yearOfBook = document.getElementById('year').value;
  const completeBox = document.getElementById('completeBox').checked;

  const bookObject = bookObjectTemplate(bookID, titleBook, authorBook, yearOfBook, completeBox);
  bookArrayList.push(bookObject);
  createHTMLBookObject(bookObject);

  alert('data berhasil ditambahkan');
});