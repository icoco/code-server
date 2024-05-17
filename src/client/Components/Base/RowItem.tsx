interface IRowItem {
    id : string ; 
    name: string;
    data: Object;
    items: IRowItem[];

    
}

export {IRowItem};