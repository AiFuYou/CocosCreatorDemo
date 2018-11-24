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
        content: cc.Node,
        scrollView: cc.Node,
        maskNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.scrollView.on('scroll-to-bottom', function () {
            cc.log('滚动到列表底部了');
        }.bind(this));
    },

    createList (data) {
        this.data = data;

        this.itemHeight = 120;//设置每个item的高
        this.topIndex = 0;//最上面的item索引id
        this.bottomIndex = 7;//最下面的item索引id
        this.offsetY = 80;//上下临界坐标补充，点击查看原理，值太小会出现item在边界闪动的情况，因为item可能此时在上下两边时均符合移动的情况，所以就会无限循环移动，此值建议自行调整

        //如果觉得这种获取临界坐标的方式比较麻烦，可以多创建几个item，指定屏幕的上下边为边界
        let scrollViewPos = this.scrollView.position;//scrollView以屏幕中心为原点的坐标，请自行计算出来
        this.topExtremeDistance = scrollViewPos.y + this.scrollView.height / 2 + this.offsetY;//获取item能到达的屏幕上边界y坐标
        this.bottomExtremeDistance = scrollViewPos.y - this.scrollView.height / 2 - this.offsetY;//获取item能到达的屏幕下边界y坐标

        this.itemsArr = [];//item存储arr

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
            //获取上下item当前的坐标
            let topPos = cc.pSub(this.itemsArr[this.topIndex].convertToWorldSpaceAR(cc.v2(0, 0)), cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
            let bottomPos = cc.pSub(this.itemsArr[this.bottomIndex].convertToWorldSpaceAR(cc.v2(0, 0)), cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));

            //检测上item是否超过边界
            if (topPos.y > this.topExtremeDistance) {
                if (this.bottomIndex >= this.data.length - 1) {
                    return;
                }
                this.updateItem(this.itemsArr[this.topIndex], this.data[this.bottomIndex + 1], this.bottomIndex + 1);
                this.topIndex ++;
                this.bottomIndex ++;
            //检测下item是否超过边界
            } else if (bottomPos.y < this.bottomExtremeDistance) {
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
            case 'mask':
                this.maskNode.getComponent(cc.Mask).enabled = !this.maskNode.getComponent(cc.Mask).enabled;
                break;
        }
    },

    update (dt) {
        this.updateItemsPos(dt);
    },
});
