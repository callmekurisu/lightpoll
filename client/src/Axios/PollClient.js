import axios from 'axios';
import { environment } from './Environment';

const PollClient = axios.create({ 
baseURL:`${environment.server}`
});

export default PollClient;