export class FirstTab {
    public thumbnail: string;
    public mainlogo: string;
    public title: string;
    public shortdescription: string;
    public fulldescription: string;
    public cuisine: string;
    public average_price: string;   
    public food_types: string;

    constructor(title='', short='', full='') {
        this.title = title;
        this.shortdescription = short;
        this.fulldescription = full;
    }
}

export class Setting {
    public timeinfo: any;
    public id: number;
    public firsttab: FirstTab;
    public images: SettingImage[];
    public information: SettingInformation;
    public address: SettingAddress;
    public seats: SettingSeat[];
    constructor() {
        this.firsttab = new FirstTab();
    }
}



export class SettingImage {
    id: number;
    restaurantId: number;
    url: string;
    status: number;
    deletedAt: Date;
    createdAt: Date;
}

export class SettingInformation {
    venue : number[];
    night: number[];
    music: number[];
    dress: number[];
    disabled: number[];
    minage: number;
    budget: number;
    covid: number;
}

export class SettingAddress {
    city: string;
    state: string;
    country: string;
    address1: string;
    address2: string;
    postalcode: string;
    lat: number;
    lng: number;
}

export class SettingSeat {
    city: string;
    state: string;
    country: string;
    address1: string;
    address2: string;
    postalcode: string;
    lat: number;
    lng: number;
}