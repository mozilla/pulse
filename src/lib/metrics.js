import Metrics from 'testpilot-metrics';
import { id, version } from 'sdk/self';

const { sendEvent } = new Metrics({ id, version, type: 'sdk' });
export default sendEvent;
