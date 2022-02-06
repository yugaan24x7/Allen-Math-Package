let path = document.querySelector('script').attributes.src.value.replace('index', 'sw')
navigator.serviceWorker.register(path);
