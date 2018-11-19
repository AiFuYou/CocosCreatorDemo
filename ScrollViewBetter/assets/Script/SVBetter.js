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
        item: cc.Prefab,
        content: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    createList (data) {
        this.itemHeight = 120;
        this.topIndex = 0;
        this.bottomIndex = 7;
        this.extremeDistance = 450;//我们的Demo中ScrollView的高度是800，所以这里用450作为临界值，这个值可以根据列表的具体显示数量来计算
        this.data = data;
        this.itemsArr = [];

        for (let i = 0; i < 8; i ++) {
            let listItem = cc.instantiate(this.item);
            listItem.parent = this.content;
            this.updateItem(listItem, this.data[i], i);
        }
        this.content.height = (data.length + 1) * this.itemHeight + 20;
    },

    updateItem (listItem, data, i) {
        listItem.y = -i * this.itemHeight - this.itemHeight / 2;
        listItem.getComponent('SVItem').updateUI(data);
        this.itemsArr[i] = listItem;
    },

    updateItemsPos (dt) {
        if (!!this.itemsArr && !!this.itemsArr[this.bottomIndex]) {
            let topPos = cc.pSub(this.itemsArr[this.topIndex].convertToWorldSpaceAR(cc.v2(0, 0)), cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
            let bottomPos = cc.pSub(this.itemsArr[this.bottomIndex].convertToWorldSpaceAR(cc.v2(0, 0)), cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));

            if (topPos.y > this.extremeDistance) {
                if (this.bottomIndex >= this.data.length - 1) {
                    return;
                }
                this.updateItem(this.itemsArr[this.topIndex], this.data[this.bottomIndex + 1], this.bottomIndex + 1);
                this.topIndex ++;
                this.bottomIndex ++;
            } else if (bottomPos.y < -this.extremeDistance) {
                if (this.topIndex < 1) {
                    return;
                }
                this.updateItem(this.itemsArr[this.bottomIndex], this.data[this.topIndex - 1], this.topIndex - 1);
                this.topIndex --;
                this.bottomIndex --;
            }
        }
    },

    onBtnClk: function (event, param) {
        switch (param) {
            case 'back':
                this.node.destroy();
                break;
        }
    },

    update (dt) {
        this.updateItemsPos(dt);
    },
});
