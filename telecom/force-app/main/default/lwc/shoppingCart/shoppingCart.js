import { LightningElement } from 'lwc';
export default class ShoppingCart extends LightningElement {
    valueAddPackage = 'inProgress';
    get options() {
        return [
            { label: 'Add package', value: 'Add package' },
        ];
    }
}