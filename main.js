// Retrieving the elements form html

const $form = document.getElementById('date-form')
const $input = document.getElementById('date-input')
const $continue = document.getElementById('continue')
const $save = document.getElementById('save')
const $favourite = document.getElementById('favourites')
const $pictureContainer = document.getElementById('picture-container')

// creating the new empty array for the favourites

let favList = []

function saveItems () {
  const favHtml = []

  for (let i=0; i < favList.length; i++) {
    favHtml.push(`
    <li>
      <div><img src="${favList[i].url}" alt=""></div>
      <div>
        <h3>${favList[i].title}</h3>
        <p>${favList[i].date}</p>
        <p>${favList[i].explanation}</p>
        <button class="btn btn-danger" data-delete="${i}">Delete</button>
      </div>
    </li>
    `)
  }

  // data-something in html
  // dataset.something in js

  $favourite.innerHTML = favHtml.join('')
}

// Fetching API and adding the api contents

async function getContent (e) {

  e.preventDefault()

  const inputDate = $input.value

  const link = `https://api.nasa.gov/planetary/apod?api_key=FVEJQcHvYlBnfLrstFGxqcaJXuHAr5feGQZEw7ql&date=${inputDate}`

  const response = await fetch(link)
  let data = await response.json()

  $pictureContainer.innerHTML = `
    <div class="picture">
      <img src="${data.url}" alt="" id="picture-image" />
    </div>
    <h3 class="picture-title">${data.title}</h3>
    <p class="picture-date">${data.date}</p>
    <p class="description">
      ${data.explanation}
    </p>
    <div class="btn-container">
      <button class="btn" id="save">Save</button>
    </div>
    <div class="overlay" id="overlay">
      <img src="${data.hdurl}" class="overlay-image" id="overlay-image">
    </div>
  `

  $form.reset()

// Creating overlay

  const $overlay = document.getElementById('overlay')
  const $pictureImage = document.getElementById('picture-image')
  const $save = document.getElementById('save')

  $pictureImage.addEventListener('click', function () {
    $overlay.classList.add('show')
  })

  $overlay.addEventListener('click', function () {
    $overlay.classList.remove('show')
  })

  $save.addEventListener('click', function () {
    favList.push({
      title: data.title,
      date: data.date,
      explanation: data.explanation,
      url: data.url,
      hdurl: data.hdurl
    })

    saveItems()

// Creating Local Storage

    localStorage.setItem('favList', JSON.stringify(favList))
  })

}



$form.addEventListener('submit', getContent)

function deleteFav (e) {
  const deleteButton = e.target.closest('[data-delete]')

  const deleteNumber = deleteButton.dataset.delete
  favList.splice(deleteNumber, 1)

  saveItems()
}

$favourite.addEventListener('click', deleteFav)

const lsFavList = localStorage.getItem('favList')

if (lsFavList) {
  favList = JSON.parse(lsFavList)

  saveItems()
}

// FVEJQcHvYlBnfLrstFGxqcaJXuHAr5feGQZEw7ql