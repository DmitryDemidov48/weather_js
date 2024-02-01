const apiKey = '12ba5693f79140ed849174618230911';

const header = document.querySelector('.header');
const form = document.querySelector('#form');
const input = document.querySelector('#inputCity');

function removeCard() {
    const lastCard = document.querySelector('.card');
    if (lastCard) {
        lastCard.remove();
    }
}

function showError(message) {
    const html = `<div class="card">${message}</div>`;
    header.insertAdjacentHTML('afterend', html);
}

function createCardElement(tag, className, innerHTML = '') {
    const element = document.createElement(tag);
    element.className = className;
    element.innerHTML = innerHTML;
    return element;
}


function getCard(weatherData) {
    const card = createCardElement('div', 'card');

    const loadingIcon = createCardElement('i', 'fas fa-spinner fa-spin loading-icon');
    const cityElement = createCardElement('h2', 'card-city', `${weatherData.name}<span>${weatherData.country}</span>`);
    const weatherInfoElement = createCardElement('div', 'card-weather');
    const tempElement = createCardElement('div', 'card-value', `${weatherData.temp}<sup>°c</sup>`);
    const imgElement = createCardElement('img', 'card-img');
    imgElement.src = weatherData.icon;
    imgElement.alt = '/';
    const descElement = createCardElement('div', 'card-desc', weatherData.text);

    weatherInfoElement.append(tempElement, imgElement);
    card.append(loadingIcon, cityElement, weatherInfoElement, descElement);

    header.insertAdjacentElement('afterend', card);

    // Загружаем иконку после отображения карточки
    loadWeatherIcon(weatherData.icon);
}

async function loadWeatherIcon(iconUrl) {
    try {
        const response = await axios.get(iconUrl, { responseType: 'blob' });

        if (response.status === 200) {
            // Если успешно загружена иконка, скрываем иконку загрузки
            const loadingIcon = document.querySelector('.loading-icon');
            if (loadingIcon) {
                loadingIcon.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error loading weather icon:', error);
    }
}

async function getWeather(city) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    try {
        const response = await axios.get(url);

        if (response.status === 200) {
            const data = response.data;

            if (data.error) {
                removeCard();
                showError(data.error.message);
            } else {
                removeCard();
                getCard({
                    name: data.location.name,
                    country: data.location.country,
                    temp: data.current.temp_c,
                    icon: data.current.condition.icon,
                    text: data.current.condition.text
                });
            }
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        removeCard();
        showError('Сервер не доступен');
    }
}

form.onsubmit = async (event) => {
    event.preventDefault();
    const city = input.value.trim();

    if (!city) {
        console.error('Please enter a city name.');
        return;
    }

    try {
        await getWeather(city);
    } catch (error) {
        console.error('Error getting weather data:', error);
    }
};
