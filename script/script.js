let map;
const content = document.querySelector(".content");


// Função para inicializar o mapa
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -22.520000, lng: -43.192600 }, // Local padrão
    zoom: 12,
  });

  const pontosSeguros = [
    { name: "Centro Comunitário A", lat: -34.397, lng: 150.644 },
    { name: "Escola B", lat: -22.520000, lng: -43.192600 },
    { name: "Abrigo C", lat: -34.390, lng: 150.640 },
    
  ];

  pontosSeguros.forEach((ponto) => {
    const marker = new google.maps.Marker({
      position: { lat: ponto.lat, lng: ponto.lng },
      map: map,
      title: ponto.name,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<h3>${ponto.name}</h3><p>Este é um ponto de apoio seguro.</p>`,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  });

  // Geolocalização
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Centraliza o mapa na localização do usuário
        map.setCenter(pos);

        // Adicionar um marcador na localização do usuário
        new google.maps.Marker({
          position: pos,
          map: map,
          title: "Você está aqui!",
          icon: {
            url: "https://raw.githubusercontent.com/Jusenx/Olha-a-chuva-Clima-tempo/d0fc110dc2c226a157bcc1d2fe82e462923c67bc/img/person-standing.svg",
            scaledSize: new google.maps.Size(30, 30),
          },
        });

        // Chama a função para buscar a cidade pela geolocalização
        getCityByCoords(pos.lat, pos.lng);
      },
      (error) => {
        console.error("Erro de geolocalização: ", error.message);
        alert("Não foi possível obter sua localização.");
      }
    );
  } else {
    alert("Seu navegador não suporta geolocalização.");
  }
}

// variavel para salvar cidade globalmente //


// Função para buscar o nome da cidade com base nas coordenadas
function getCityByCoords(latitude, longitude) {
  const geocodeURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  fetch(geocodeURL)
    .then((response) => response.json())
    .then((data) => {
      let cidadeNome = data.address.city || data.address.town || data.address.village;
      if (cidadeNome) {
        console.log("Cidade encontrada:", cidadeNome)

        function printar() {

          async function getDataApi() {
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(
              cidadeNome
            )}&units=metric&appid=da970a0413d7263b46ef468ca8d7e316`;

            try {
              await fetch(url)
                .then((res) => res.json())
                .then((data) => {
                  if (data?.cod && data.cod === "404") {
                    return alert("Local não encontrado!");
                  }

                  loadData(data);
                });
            } catch (error) {
              alert(error);
            }
          }
          getDataApi()

          function loadData(data) {
            place.innerHTML = `${data.name}, ${data.sys.country}`;
            degrees.innerHTML = `Temperatura: ${Math.floor(data.main.temp)}° C`;
            wind.innerHTML = `Vento: ${data.wind.speed} km/h`;
            content.style.display = "flex";
          }
        }
        printar()






      } else {
        alert("Não foi possível encontrar uma cidade próxima.");
      }


    })
    .catch((error) => {
      console.error("Erro ao buscar a cidade:", error);
      alert("Erro ao tentar obter a cidade.");
    });
}



