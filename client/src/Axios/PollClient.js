import axios from 'axios';
import { environment } from './Environment';

const PollClient = axios.create({ 
baseURL:`${environment.context}`
});

export default PollClient;