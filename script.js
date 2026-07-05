const btnCatalogo = document.getElementById('btn-catalogo');
const btnTema = document.getElementById('btn-tema');
const btnCarrinhoPrincipal = document.getElementById('btn-carrinho-principal');
const menuLateral = document.getElementById('menu-lateral');
const carrinhoMenu = document.getElementById('carrinho-menu');
const btnFechar = document.getElementById('btn-fechar');
const btnFecharCarrinho = document.getElementById('btn-fechar-carrinho');
const overlay = document.getElementById('overlay');
const linksMenu = document.querySelectorAll('.link-menu');
const botoesComprar = document.querySelectorAll('.btn-comprar');
const carrinhoItens = document.getElementById('carrinho-itens');
const carrinhoTotal = document.getElementById('carrinho-total');
const btnFinalizar = document.querySelector('.btn-finalizar');
const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');

function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function abrirMenu(event) {
    event.preventDefault();
    fecharCarrinho();
    menuLateral.classList.add('aberto');
    overlay.classList.add('aberto');
}

function fecharMenu(event) {
    if (event) event.preventDefault();
    menuLateral.classList.remove('aberto');
    overlay.classList.remove('aberto');
}

function abrirCarrinho() {
    fecharMenu();
    carrinhoMenu.classList.add('aberto');
    overlay.classList.add('aberto');
}

function fecharCarrinho(event) {
    if (event) event.preventDefault();
    carrinhoMenu.classList.remove('aberto');
    overlay.classList.remove('aberto');
}

function getCbjrItens(itens = carrinho) {
    return itens.filter((item) => {
        const nome = typeof item.nome === 'string' ? item.nome.toLowerCase() : '';
        return item.cbjr === true || nome.includes('charlie brown') || nome.includes('cbjr');
    });
}

function calcularPromocao(itens = carrinho) {
    const cbjrItens = getCbjrItens(itens);

    if (cbjrItens.length === 0) {
        return { desconto: 0, ativa: false };
    }

    const unidadesTotais = cbjrItens.reduce((soma, item) => soma + item.quantidade, 0);
    if (unidadesTotais < 3) {
        return { desconto: 0, ativa: false };
    }

    const itensDisponiveis = cbjrItens.map((item) => ({
        nome: item.nome,
        preco: item.preco,
        quantidade: item.quantidade
    }));

    let desconto = 0;
    let unidadesRestantes = unidadesTotais;

    while (unidadesRestantes >= 3) {
        itensDisponiveis.sort((a, b) => a.preco - b.preco);
        const itemMaisBarato = itensDisponiveis.find((item) => item.quantidade > 0);

        if (!itemMaisBarato) {
            break;
        }

        desconto += itemMaisBarato.preco;
        itemMaisBarato.quantidade -= 1;
        unidadesRestantes -= 3;
    }

    return { desconto, ativa: desconto > 0 };
}

function renderizarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    if (carrinho.length === 0) {
        if (carrinhoItens) {
            carrinhoItens.innerHTML = '<p class="cart-vazio">Seu carrinho está vazio.</p>';
        }
        if (carrinhoTotal) {
            carrinhoTotal.textContent = 'R$ 0,00';
        }
        return;
    }

    if (carrinhoItens) {
        carrinhoItens.innerHTML = '';
    }

    let total = 0;
    const promo = calcularPromocao();

    carrinho.forEach((item, index) => {
        total += item.preco * item.quantidade;
        const imagemItem = item.imagem || 'IMGs/porcao3.png';
        const itemHTML = document.createElement('div');
        itemHTML.className = 'cart-item';
        itemHTML.innerHTML = `
            <img class="cart-item-img" src="${imagemItem}" alt="${item.nome}">
            <div class="cart-item-info">
                <strong>${item.nome}</strong>
                <p>${item.quantidade}x • ${formatarPreco(item.preco)}</p>
            </div>
            <div class="cart-item-actions">
                <button type="button" class="btn-remover btn-remover-um" data-index="${index}" data-action="decrement">-1</button>
                <button type="button" class="btn-remover btn-remover-tudo" data-index="${index}" data-action="remove-all">Remover</button>
            </div>
        `;
        carrinhoItens.appendChild(itemHTML);
    });

    if (promo.ativa) {
        const aviso = document.createElement('p');
        aviso.className = 'promo-cbjr';
        aviso.textContent = `Promoção ativa: 1 CD mais barato do CBJR grátis a cada grupo de 3 unidades!`;
        carrinhoItens.appendChild(aviso);
        total -= promo.desconto;
    }

    if (carrinhoTotal) {
        carrinhoTotal.textContent = formatarPreco(total);
    }
}

function adicionarAoCarrinho(card) {
    const nome = card.querySelector('.nome-cd').textContent.trim();
    const imagemElemento = card.querySelector('.capa-cd');
    const imagem = imagemElemento ? imagemElemento.getAttribute('src') : 'IMGs/porcao3.png';
    const precoTexto = card.querySelector('.preco-cd').textContent.trim().replace('.', '').replace(',', '.');
    const preco = Number(precoTexto);
    const section = card.closest('section');
    const ehCbjr = Boolean(section && section.id === 'secao-CBJR');
    const itemExistente = carrinho.find((item) => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += 1;
        if (ehCbjr) {
            itemExistente.cbjr = true;
        }
    } else {
        carrinho.push({ nome, imagem, preco, quantidade: 1, cbjr: ehCbjr });
    }

    renderizarCarrinho();
    abrirCarrinho();
}

function aplicarTema() {
    const temaAtual = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark', temaAtual === 'dark');

    const adImg = document.querySelector('.ADimg');
    if (adImg) {
        adImg.style.backgroundImage = temaAtual === 'dark'
            ? "url('IMGs/porcao6.png')"
            : "url('IMGs/porcao5.png')";
    }

    if (btnTema) {
        btnTema.setAttribute('aria-pressed', String(temaAtual === 'dark'));
        btnTema.classList.remove('theme-switching');
    }
}

function alternarTema() {
    const novoTema = document.body.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem('theme', novoTema);
    if (btnTema) {
        btnTema.classList.add('theme-switching');
        setTimeout(() => btnTema.classList.remove('theme-switching'), 350);
    }
    aplicarTema();
}

if (btnCatalogo) {
    btnCatalogo.addEventListener('click', abrirMenu);
}

if (btnTema) {
    btnTema.addEventListener('click', alternarTema);
}

if (btnCarrinhoPrincipal) {
    btnCarrinhoPrincipal.addEventListener('click', abrirCarrinho);
}

if (btnFechar) {
    btnFechar.addEventListener('click', fecharMenu);
}

if (btnFecharCarrinho) {
    btnFecharCarrinho.addEventListener('click', fecharCarrinho);
}

if (overlay) {
    overlay.addEventListener('click', () => {
        fecharMenu();
        fecharCarrinho();
    });
}

linksMenu.forEach((link) => {
    link.addEventListener('click', () => {
        fecharMenu();
        fecharCarrinho();
    });
});

botoesComprar.forEach((botao) => {
    botao.addEventListener('click', (event) => {
        event.preventDefault();
        const card = botao.closest('.card-cd');
        if (card) {
            adicionarAoCarrinho(card);
        }
    });
});

if (carrinhoItens) {
    carrinhoItens.addEventListener('click', (event) => {
        const botao = event.target.closest('.btn-remover');
        if (!botao) return;

        const index = Number(botao.dataset.index);
        const acao = botao.dataset.action;
        const item = carrinho[index];

        if (!item) return;

        if (acao === 'decrement') {
            item.quantidade -= 1;
            if (item.quantidade <= 0) {
                carrinho.splice(index, 1);
            }
        } else if (acao === 'remove-all') {
            carrinho.splice(index, 1);
        }

        renderizarCarrinho();
    });
}

if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
        window.location.href = 'finalizacao.html';
    });
}

aplicarTema();
renderizarCarrinho();

const form = document.querySelector('.checkout-form');
const btnTemaCheckout = document.getElementById('btn-tema');
const carrinhoCheckout = JSON.parse(localStorage.getItem('carrinho') || '[]');

if (form) {
    if (carrinhoCheckout.length === 0) {
        const aviso = document.createElement('p');
        aviso.textContent = 'Seu carrinho está vazio. Adicione algum CD antes de finalizar a compra.';
        aviso.style.color = '#931515';
        aviso.style.fontWeight = 'bold';
        aviso.style.marginTop = '15px';
        form.insertAdjacentElement('beforebegin', aviso);
        const botao = document.querySelector('.btn-finalizar');
        botao.disabled = true;
        botao.style.opacity = '0.6';
        botao.style.cursor = 'not-allowed';
    }

    const promoCheckout = calcularPromocao(carrinhoCheckout);
    if (promoCheckout.ativa) {
        const avisoPromo = document.createElement('p');
        avisoPromo.className = 'promo-cbjr';
        avisoPromo.textContent = 'Promoção ativada: 1 CD mais barato do CBJR grátis a cada grupo de 3 unidades.';
        form.insertAdjacentElement('beforebegin', avisoPromo);
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (carrinhoCheckout.length === 0) {
            alert('Adicione pelo menos um item ao carrinho antes de confirmar o pedido.');
            return;
        }
        alert('Pedido confirmado com sucesso!');
    });
}

if (btnTemaCheckout) {
    btnTemaCheckout.addEventListener('click', alternarTema);
}
