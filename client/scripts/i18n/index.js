import {addLocaleData, IntlProvider} from 'react-intl';
import deLocaleData from 'react-intl/locale-data/de';
import enLocaleData from 'react-intl/locale-data/en';
import frLocaleData from 'react-intl/locale-data/fr';
import nlLocaleData from 'react-intl/locale-data/nl';

addLocaleData(deLocaleData);
addLocaleData(enLocaleData);
addLocaleData(frLocaleData);
addLocaleData(nlLocaleData);

export {default as de} from './de';
export {default as en} from './en';
export {default as fr} from './fr';
export {default as nl} from './nl';
