// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        scrollView: cc.Prefab,
        scrollViewBetter: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.data = [];
        for (let i = 0; i < 1000; i ++) {
            this.data[i] = {des: 'test' + i, id: i, icon: 'xxx'};
        }
    },

    onBtnClk: function (event, param) {
        switch (param) {
            case 'normal':
                let dialog1 = cc.instantiate(this.scrollView);
                dialog1.parent = this.node;
                dialog1.getComponent('SV').createList(this.data);
                break;
            case 'better':
                let dialog2 = cc.instantiate(this.scrollViewBetter);
                dialog2.parent = this.node;
                dialog2.getComponent('SVBetter').createList(this.data);
                break;
        }
    }

    // update (dt) {},
});
