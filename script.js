let page = 0
const endPointGeral =
  'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false'

//----------funcoes auxiliares----------------------

//----------popular pagina filmes-------------------

async function populateMovies(contador, limite, endpoint) {
  const movies = document.querySelector('.movies')

  const moviesObjectsArray = await (await fetch(endpoint)).json()

  for (let i = contador; i < limite; i++) {
    const movie = moviesObjectsArray.results[i]
    const movie_div = document.createElement('div')

    movie_div.classList.add('movie')
    // movie_div.setAttribute(id, movie.belongs_to_collection.id)
    movie_div.style.backgroundImage = `url('${movie.poster_path}')`
    movie_div.style.backgroundSize = '100%'
    movie_div.style.backgroundRepeat = 'no-repeat'

    movie_div.addEventListener('click', () => {
      const modal_div = document.querySelector('.modal_div')

      modal_div.classList.remove('hidden')

      populateModal(movie.id)
    })

    const info = document.createElement('div')
    info.classList.add('movie__info')
    info.classList.add('flex-row,justify-between')

    const title = document.createElement('span')
    title.classList.add('movie__title')
    title.innerText = movie.title

    const rating = document.createElement('span')
    rating.classList.add('movie__rating')
    rating.innerText = movie.vote_average

    const img = document.createElement('img')
    img.src = './assets/estrela.svg'

    movie_div.append(info)
    info.append(title, rating)
    rating.append(img)

    movies.append(movie_div)
  }
  page++
}

//----------limpar filmes----------------------------

function cleanMovies() {
  const movieDivs = document.querySelectorAll('.movie')

  movieDivs.forEach((div) => {
    div.remove()
  })
}

//----------popular highlight

async function populateHighlight() {
  const highlight__video = document.querySelector('.highlight__video')
  const highlight__title = document.querySelector('.highlight__title')
  const highlight__rating = document.querySelector('.highlight__rating')
  const highlight__genres = document.querySelector('.highlight__genres')
  const highlight__launch = document.querySelector('.highlight__launch')
  const highlight__description = document.querySelector(
    '.highlight__description',
  )

  const highlight__video_link = document.querySelector('.highlight__video-link')

  const endPointGeral = await (
    await fetch(
      'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR',
    )
  ).json()

  const endPointVideo = await (
    await fetch(
      'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR',
    )
  ).json()

  highlight__video.style.backgroundImage = `url('${endPointGeral.backdrop_path}')`
  highlight__video.style.backgroundSize = '100%'
  highlight__video.style.backgroundRepeat = 'no-repeat'

  highlight__title.innerText = endPointGeral.title

  highlight__rating.innerText = endPointGeral.vote_average

  let genres = endPointGeral.genres
  for (let i = 0; i < genres.length; i++) {
    highlight__genres.innerHTML += `${genres[i].name},`
  }

  highlight__launch.innerText = `/${endPointGeral.release_date}`

  highlight__description.innerText = endPointGeral.overview

  highlight__video_link.href = `https://www.youtube.com/watch?v=${endPointVideo.results[0].key}`
}

//----------popular modal-------------------------------

const movie = document.querySelector('.movie')
const modal = document.querySelector('.modal')

async function populateModal(id) {
  const endPointModal = await (
    await fetch(
      `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`,
    )
  ).json()

  const modal__title = document.querySelector('.modal__title')
  const modal__img = document.querySelector('.modal__img')
  const modal__description = document.querySelector('.modal__description')
  const modal__genres_average = document.querySelector('.modal__genre-average')

  modal__title.innerText = endPointModal.title
  modal__img.style.backgroundImage = `url('${endPointModal.backdrop_path}')`
  modal__img.style.backgroundSize = '100%'
  modal__img.style.backgroundRepeat = 'no-repeat'

  modal__img.addEventListener('click', function (event) {
    event.stopPropagation()
  })

  modal__description.innerText = endPointModal.overview

  const genresDiv = document.createElement('div')
  genresDiv.classList.add('flex-row')
  genresDiv.classList.add('genres_div')

  modal__genres_average.append(genresDiv)

  const genresArray = endPointModal.genres
  for (let i = 0; i < genresArray.length; i++) {
    const genre = document.createElement('div')
    genre.classList.add('modal__genres')
    genre.innerHTML = genresArray[i].name
    genresDiv.append(genre)
  }

  const modal__average = document.createElement('div')
  modal__average.classList.add('modal__average')
  modal__average.innerText = endPointModal.vote_average

  modal__genres_average.append(modal__average)

  //-------------fechar modal---------------------------

  const modalClose = document.querySelector('.modal__close')
  const modal_div = document.querySelector('.modal_div')

  modalClose.addEventListener('click', function () {
    modal_div.classList.add('hidden')

    genresDiv.remove()
    modal__average.remove()
  })

  modal_div.addEventListener('click', () => {
    modal_div.classList.add('hidden')

    genresDiv.remove()
    modal__average.remove()
  })
}

//----------Inicio carregamento pagina-------------------------

populateHighlight()

populateMovies(0, 5, endPointGeral)

const btnPrevious = document.querySelector('.btn-prev')
const btnNext = document.querySelector('.btn-next')

btnNext.addEventListener('click', (event) => {
  cleanMovies()

  if (page === 1) {
    populateMovies(5, 10, endPointGeral)
  }

  if (page === 2) {
    populateMovies(10, 15, endPointGeral)
  }

  if (page === 3) {
    populateMovies(15, 20, endPointGeral)
  }

  if (page === 4) {
    populateMovies(0, 5, endPointGeral)
    page = 0
  }
})

btnPrevious.addEventListener('click', (event) => {
  cleanMovies()

  if (page === 1) {
    populateMovies(15, 20, endPointGeral)
  }

  if (page === 2) {
    populateMovies(10, 15, endPointGeral)
  }

  if (page === 3) {
    populateMovies(5, 10, endPointGeral)
  }

  if (page === 4) {
    populateMovies(0, 5, endPointGeral)
    page = 0
  }
})

const inputBusca = document.querySelector('.input')

inputBusca.addEventListener('keydown', async function (event) {
  if (inputBusca.value === '' || event.key !== 'Enter') {
    cleanMovies()

    populateMovies(0, 5, endPointGeral)
    page = 0
    return
  }

  cleanMovies()
  populateMovies(
    0,
    5,
    `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${inputBusca.value}`,
  )
  inputBusca.value = ''
})

//-------------Dark Light Mode----------------------

const btnTheme = document.querySelector('.btn-theme')
const body = document.querySelector('body')

btnTheme.addEventListener('click', function () {
  btnTheme.src =
    btnTheme.src ===
    'http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/light-mode.svg'
      ? 'http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/dark-mode.svg'
      : 'http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/light-mode.svg'

  body.style.setProperty(
    '--background',
    body.style.getPropertyValue('--background') === '#242424'
      ? '#fff'
      : '#242424',
  )

  body.style.setProperty(
    '--high-light-background',
    body.style.getPropertyValue('--high-light-background') === '#454545'
      ? '#fff'
      : '#454545',
  )

  body.style.setProperty(
    '--light-text',
    body.style.getPropertyValue('--light-text') === '#fff' ? '#000' : '#fff',
  )
  body.style.setProperty(
    '--light-title',
    body.style.getPropertyValue('--light-title') === 'rgb(43, 42, 42)'
      ? '#FDFDFD'
      : 'rgb(43, 42, 42)',
  )

  btnPrevious.src =
    btnPrevious.src ===
    'http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/seta-esquerda-preta.svg'
      ? 'http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/seta-esquerda-branca.svg'
      : 'http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/seta-esquerda-preta.svg'

  btnNext.src =
    btnNext.src ===
    'http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/seta-direita-preta.svg'
      ? 'http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/seta-direita-branca.svg'
      : 'http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/seta-direita-preta.svg'
})
