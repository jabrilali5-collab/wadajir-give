import type { Locale } from "./i18n/config";

type QA = { q: string; a: string };

const en: QA[] = [
  {
    q: "Does Wadajir Give charge a fee?",
    a: "Organizers pay no platform fee. Card payments carry a processing fee charged by our payment provider (Stripe), which is deducted before payout. Donors can add an optional tip to support Wadajir Give; the tip can be zero.",
  },
  {
    q: "How do you check that a fundraiser is real?",
    a: "Every fundraiser is reviewed by a person before it's published. We may ask the organizer for documents such as a hospital letter, funeral home invoice or proof of relationship. Organizers who complete identity verification get a verified badge, and the badge is never shown otherwise.",
  },
  {
    q: "Is my donation tax-deductible?",
    a: "Usually not. Most fundraisers on Wadajir Give are personal gifts to individuals or families, which are generally not tax-deductible. If a fundraiser is run by a registered charity, that charity will say so and provide its own receipt.",
  },
  {
    q: "Can I raise money for someone in Somalia?",
    a: "Yes — you can raise money for people and projects anywhere. Right now, payouts go to organizers with a US bank account, who are responsible for getting funds to the beneficiary. We're working on safe ways to support organizers in other countries.",
  },
  {
    q: "Can I give Zakat through Wadajir Give?",
    a: "You can give to fundraisers in the Zakat & Sadaqah category. Whether a specific fundraiser meets the conditions of Zakat is a religious question; we recommend checking with a scholar or your local masjid. Wadajir Give does not certify fundraisers as Zakat-eligible.",
  },
  {
    q: "When does the organizer receive the money?",
    a: "Once the organizer has connected a verified US bank account through our payment provider, funds are paid out on a rolling schedule. Payouts can be held while a report about the fundraiser is being reviewed.",
  },
  {
    q: "What if I think a fundraiser is a scam?",
    a: "Use the \"Report this fundraiser\" link on its page. Reports go directly to our review team, who can pause the fundraiser and hold payouts while they investigate.",
  },
  {
    q: "Is my card information safe?",
    a: "Card details are entered on Stripe's secure payment page. Wadajir Give never sees or stores your full card number.",
  },
];

const so: QA[] = [
  {
    q: "Wadajir Give ma qaadaa khidmad?",
    a: "Qabanqaabiyeyaashu ma bixiyaan khidmad goob. Lacag-bixinta kaarku waxay leedahay khidmad ay qaado shirkadda lacag-bixinta (Stripe), taas oo laga jarayo ka hor lacag-bixinta. Deeq-bixiyeyaashu waxay ku dari karaan abaal-marin ikhtiyaari ah oo lagu taageerayo Wadajir Give; abaal-marintu waxay noqon kartaa eber.",
  },
  {
    q: "Sideed u hubisaan in ololuhu run yahay?",
    a: "Olole kasta waxaa dib u eega qof ka hor inta aan la daabicin. Waxaan qabanqaabiyaha weydiin karnaa dukumentiyo sida warqad isbitaal, qaansheegad aas ama caddayn xiriir. Qabanqaabiyeyaasha dhammeeya xaqiijinta aqoonsiga waxay helaan calaamad xaqiijin, calaamaddaasna marnaba lama muujiyo haddii kale.",
  },
  {
    q: "Deeqdaydu ma laga jari karaa canshuurta?",
    a: "Badanaa maya. Inta badan ololeyaasha Wadajir Give waa hadiyado shakhsi ah oo loo bixiyo shakhsiyaad ama qoysas, kuwaas oo guud ahaan aan canshuurta laga jarin. Haddii olole ay maamusho hay'ad samafal oo diiwaangashan, hay'addaasi way sheegi doontaa waxayna bixin doontaa rasiid u gaar ah.",
  },
  {
    q: "Ma u ururin karaa lacag qof Soomaaliya jooga?",
    a: "Haa — waxaad lacag u ururin kartaa dad iyo mashaariic meel kasta. Hadda, lacag-bixintu waxay u socotaa qabanqaabiyeyaasha leh akoon bangi oo Maraykan ah, kuwaas oo mas'uul ka ah gaarsiinta lacagta qofka loo ururiyey. Waxaan ka shaqaynaynaa habab ammaan ah oo lagu taageero qabanqaabiyeyaasha dalal kale.",
  },
  {
    q: "Ma ku bixin karaa Sakada Wadajir Give?",
    a: "Waxaad ku deeqi kartaa ololeyaasha qaybta Sako & Sadaqo. In olole gaar ahi buuxiyo shuruudaha Sakada waa su'aal diini ah; waxaan kugula talinaynaa inaad la tashato caalim ama masaajidkaaga. Wadajir Give ma caddeyso in olole u qalmo Sako.",
  },
  {
    q: "Goorma ayuu qabanqaabiyuhu helaa lacagta?",
    a: "Marka qabanqaabiyuhu ku xiro akoon bangi oo Maraykan ah oo la xaqiijiyey shirkadda lacag-bixinta, lacagta waxaa loo bixiyaa jadwal joogto ah. Lacag-bixinta waa la hakin karaa inta warbixin ku saabsan ololaha la baarayo.",
  },
  {
    q: "Maxaan sameeyaa haddii aan u malaynayo in ololuhu khayaano yahay?",
    a: "Isticmaal link-ga \"Soo sheeg ololahan\" ee boggiisa ku yaal. Warbixinnadu waxay si toos ah u gaaraan kooxda dib-u-eegista, kuwaas oo hakin kara ololaha iyo lacag-bixinta inta ay baarayaan.",
  },
  {
    q: "Macluumaadka kaarkaygu ma ammaan baa?",
    a: "Faahfaahinta kaarka waxaa lagu qoraa bogga lacag-bixinta ammaanka ah ee Stripe. Wadajir Give marnaba ma arko mana kaydiso lambarka kaarkaaga oo dhammaystiran.",
  },
];

export function getFaq(locale: Locale): QA[] {
  return locale === "so" ? so : en;
}
