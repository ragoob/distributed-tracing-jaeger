import { get } from 'env-var';

export class AppConfig {
    public static readonly FUAULTY : boolean = get('FUAULTY').required().asBool();
}