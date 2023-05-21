const unreadInboxContainer = document.querySelector('#unreadInbox');
const readInboxContainer = document.querySelector('#readInbox');

const expandEmail = (emailEl, emailId) => {
  fetch(`https://apps.kodim.cz/daweb/trening-api/apis/emails/${emailId}`)
    .then(response => response.json())
    .then(email => {
      const emailBodyEl = document.createElement('div');
      emailBodyEl.className = 'email__body';
      emailBodyEl.textContent = email.body;

      emailEl.classList.add('email--expand');
      emailEl.appendChild(emailBodyEl);
    })
    .catch(error => console.error(error));
};

const createEmailElement = (email) => {
  const emailEl = document.createElement('div');
  emailEl.className = 'email';

  const emailHeadEl = document.createElement('div');
  emailHeadEl.className = 'email__head';
  emailHeadEl.addEventListener('click', () => {
    const isExpanded = emailEl.classList.contains('email--expand');

    if (!isExpanded) {
      expandEmail(emailEl, email.id);
    } else {
      emailEl.classList.remove('email--expand');
      emailEl.querySelector('.email__body').remove();
    }
  });

  const emailIconEl = document.createElement('button');
  emailIconEl.className = 'email__icon email__icon--closed';
  if (email.folder === 'read') {
    emailIconEl.classList.add('email__icon--opened');
  }
  emailHeadEl.appendChild(emailIconEl);

  const emailInfoEl = document.createElement('div');
  emailInfoEl.className = 'email__info';

  const emailSenderEl = document.createElement('div');
  emailSenderEl.className = 'email__sender';
  emailSenderEl.textContent = email.from;
  emailInfoEl.appendChild(emailSenderEl);

  const emailSubjectEl = document.createElement('div');
  emailSubjectEl.className = 'email__subject';
  emailSubjectEl.textContent = email.subject;
  emailInfoEl.appendChild(emailSubjectEl);

  emailHeadEl.appendChild(emailInfoEl);

  const emailTimeEl = document.createElement('div');
  emailTimeEl.className = 'email__time';
  emailTimeEl.textContent = email.date;
  emailHeadEl.appendChild(emailTimeEl);

  emailEl.appendChild(emailHeadEl);

  return emailEl;
};


fetch('https://apps.kodim.cz/daweb/trening-api/apis/emails?folder=unread')
  .then(response => response.json())
  .then(data => {
    const unreadEmails = data.emails || [];

    unreadEmails.forEach(email => {
      const emailEl = createEmailElement(email);
      unreadInboxContainer.appendChild(emailEl);
    });
  })
  .catch(error => console.error(error));


fetch('https://apps.kodim.cz/daweb/trening-api/apis/emails?folder=read')
  .then(response => response.json())
  .then(data => {
    const readEmails = data.emails || [];

    readEmails.forEach(email => {
      const emailEl = createEmailElement(email);
      emailEl.querySelector('.email__icon').classList.add('email__icon--opened');
      readInboxContainer.appendChild(emailEl);
    });
  })
  .catch(error => console.error(error));