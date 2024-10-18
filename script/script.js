let map;

// Função para inicializar o mapa
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -22.520000, lng: -43.192600 }, // Local padrão
    zoom: 12,
  });

  // Exemplo de lista de locais seguros
  const pontosSeguros = [
    { name: "Centro Comunitário A", lat: -34.397, lng: 150.644 },
    { name: "Escola B", lat: -22.520000, lng: -43.192600 },
    { name: "Abrigo C", lat: -34.390, lng: 150.640 },
  ];

  // Criar marcadores para cada local seguro
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

        // Opcional: adicionar um marcador na localização do usuário
        new google.maps.Marker({
          position: pos,
          map: map,
          title: "Você está aqui!",
          icon: "http://www.w3.org/2000/svg"
        });
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
