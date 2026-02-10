// Configuração do Google Sheets
const SHEET_ID = 'YOUR_SHEET_ID_HERE'; // O usuário deve substituir pelo ID da planilha dele
const SHEET_TABS = {
    config: '0', // GID da primeira aba (geralmente 0)
    services: '1' // GID da segunda aba (geralmente 1 ou outro número após criar)
};

// Dados padrão caso a planilha não esteja configurada ou ocorra erro
const DEFAULT_DATA = {
    config: {
        businessname: 'Seu Negócio',
        businessdescription: 'Prestador de serviços profissional',
        businessphone: '(11) 99999-9999',
        businessemail: 'contato@seunegocio.com.br',
        businessaddress: 'São Paulo, SP',
        businesslogo: '',
        herotitle: 'Bem-vindo ao nosso site',
        herosubtitle: 'Serviços profissionais de qualidade para você e sua empresa',
        herobuttontext: 'Saiba Mais',
        abouttitle: 'Sobre Nós',
        aboutdescription: 'Somos uma equipe dedicada a oferecer os melhores serviços com excelência e comprometimento.',
        aboutimage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        heroimage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1920&q=80'
    },
    services: [
        { title: 'Serviço 1', description: 'Descrição detalhada do primeiro serviço oferecido pela empresa.', icon: '🎯' },
        { title: 'Serviço 2', description: 'Descrição detalhada do segundo serviço oferecido pela empresa.', icon: '⭐' },
        { title: 'Serviço 3', description: 'Descrição detalhada do terceiro serviço oferecido pela empresa.', icon: '🚀' }
    ]
};

async function init() {
    let siteData = JSON.parse(JSON.stringify(DEFAULT_DATA));

    if (SHEET_ID && SHEET_ID !== 'YOUR_SHEET_ID_HERE') {
        try {
            // Tentativa de carregar dados da planilha
            const configRows = await fetchSheetTab(SHEET_ID, SHEET_TABS.config);
            if (configRows && configRows.length > 1) {
                siteData.config = parseConfig(configRows);
            }

            const servicesRows = await fetchSheetTab(SHEET_ID, SHEET_TABS.services);
            if (servicesRows && servicesRows.length > 1) {
                siteData.services = parseServices(servicesRows);
            }
        } catch (error) {
            console.error('Erro ao carregar dados da planilha. Usando dados padrão.', error);
        }
    }

    renderSite(siteData);
    setupEventListeners();
    document.getElementById('loading').classList.add('hidden');
}

async function fetchSheetTab(sheetId, gid) {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (e) {
        return null;
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    return lines.map(line => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    });
}

function parseConfig(rows) {
    const headers = rows[0].map(h => h.toLowerCase().trim());
    const values = rows[1];
    const config = {};
    headers.forEach((header, i) => {
        if (values[i]) config[header] = values[i];
    });
    return { ...DEFAULT_DATA.config, ...config };
}

function parseServices(rows) {
    const headers = rows[0].map(h => h.toLowerCase().trim());
    return rows.slice(1).map(row => {
        const service = {};
        headers.forEach((header, i) => {
            service[header] = row[i] || '';
        });
        return service;
    }).filter(s => s.title);
}

function renderSite(data) {
    const { config, services } = data;

    document.title = config.businessname;

    const logoImg = document.getElementById('header-logo');
    if (config.businesslogo) {
        logoImg.src = config.businesslogo;
        logoImg.alt = config.businessname;
        logoImg.classList.remove('hidden');
    }
    document.getElementById('header-name').textContent = config.businessname;

    document.getElementById('hero-bg').style.backgroundImage = `url('${config.heroimage || DEFAULT_DATA.config.heroimage}')`;
    document.getElementById('hero-title').textContent = config.herotitle;
    document.getElementById('hero-subtitle').textContent = config.herosubtitle;
    document.getElementById('hero-btn').textContent = config.herobuttontext;

    const servicesGrid = document.getElementById('services-grid');
    servicesGrid.innerHTML = services.map(service => `
        <div class="bg-white p-8 rounded-2xl border border-border hover:shadow-xl transition-all group">
            <div class="text-4xl mb-6">${service.icon || '🛠️'}</div>
            <h3 class="text-xl font-bold mb-4">${service.title}</h3>
            <p class="text-muted text-sm leading-relaxed mb-6">${service.description}</p>
            <a href="#contact" class="text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                Saiba mais <span>→</span>
            </a>
        </div>
    `).join('');

    document.getElementById('about-image').src = config.aboutimage || DEFAULT_DATA.config.aboutimage;
    document.getElementById('about-title').textContent = config.abouttitle;
    document.getElementById('about-description').textContent = config.aboutdescription;

    document.getElementById('contact-phone').textContent = config.businessphone;
    document.getElementById('contact-email').textContent = config.businessemail;
    document.getElementById('contact-address').textContent = config.businessaddress;

    document.getElementById('footer-name').textContent = config.businessname;
    document.getElementById('footer-phone-link').textContent = config.businessphone;
    document.getElementById('footer-phone-link').href = `tel:${config.businessphone.replace(/\D/g, '')}`;
    document.getElementById('footer-email-link').textContent = config.businessemail;
    document.getElementById('footer-email-link').href = `mailto:${config.businessemail}`;
    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('footer-copyright-name').textContent = config.businessname;

    const waPhone = config.businessphone.replace(/\D/g, '');
    const waMsg = encodeURIComponent(`Olá! Gostaria de saber mais sobre os serviços da ${config.businessname}.`);
    document.getElementById('whatsapp-btn').href = `https://wa.me/${waPhone}?text=${waMsg}`;
}

function setupEventListeners() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

init();
