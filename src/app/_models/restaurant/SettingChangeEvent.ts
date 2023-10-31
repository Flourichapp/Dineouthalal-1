import { Setting } from './setting';
export class SettingChangeEvent {
    public tabid: number;
    public setting: Setting;
    public component: string;
}