<template>
  <div class="wrapper">
    <div class="topDiv">
      <div class="icon">
        <span></span>
      </div>
    </div>
    <!-- 主体内容 -->
    <div class="contentDiv">
      <div class="content">
        <ul class="form-ul">
          <li>
            <div class="title">
              <span class="spe">企业名称</span><input
                type="text"
                v-model="formInfo.name"
                maxlength="50"
              >
            </div>
          </li>
          <li>
            <div
              class="title"
              @click="industryShow=true"
            >
              <span class="spe">所属行业</span>
              <input
                type="text"
                readonly
                placeholder="请选择"
                v-model="industryName"
              >
            </div>
            <b></b>
          </li>
          <li>
            <div
              class="title"
              @click="fieldShow=true"
            >
              <span class="spe">细分领域</span>
              <input
                v-model="fieldCompu"
                type="text"
                readonly
                placeholder="请选择"
              >
            </div>
            <b></b>
          </li>
          <li>
            <div
              class="title"
              @click="cityShow=true"
            >
              <span class="spe">城市</span>
              <input
                v-model="formInfo.address"
                type="text"
                readonly
                placeholder="请选择"
              >
            </div>
            <b></b>
          </li>
          <li>
            <div class="title">
              <span class="spe">联系人姓名</span><input
                type="text"
                v-model="formInfo.contact"
                maxlength="60"
              >
            </div>
          </li>
          <li>
            <div class="title">
              <span class="spe">联系人手机</span><input
                type="text"
                v-model="formInfo.contactPhone"
              >
            </div>
          </li>
          <li>
            <div class="title">
              <span class="spe">联系人邮箱</span><input
                type="text"
                v-model="formInfo.contactEmail"
                maxlength="100"
              >
            </div>
          </li>
          <div class="textDiv">
            <van-field
              v-model="formInfo.remark"
              rows="1"
              autosize
              label="其他问题"
              type="textarea"
              maxlength="1000"
              placeholder="如果您有其他需要解决的融资问题，可写到下方，我们会尽快与您联系"
            />
          </div>

        </ul>
        <!-- 所属行业 弹窗 -->
        <van-popup
          class="industryDiv"
          v-model="industryShow"
          position="bottom"
          :style="{ minHeight: '30%' }"
        >
          <div class="header">
            <span class="cancel"></span>
            <h3>所属行业</h3>
            <span class="sure"></span>
          </div>
          <ul>
            <li
              :class="{'active':formInfo.industryCode ==index+1}"
              v-for="(oneIndu,index) in industryArr"
              :key="index"
              @click="formInfo.industryCode=index+1;industryName = oneIndu;industryShow=false"
            >{{oneIndu}}</li>
          </ul>
        </van-popup>

        <!-- 细分领域  弹框 -->
        <van-popup
          class="industryDiv"
          v-model="fieldShow"
          position="bottom"
          :style="{ minHeight: '30%' }"
        >
          <div class="header">
            <span
              class="cancel"
              @click="fieldShow=false"
            >取消</span>
            <h3>细分领域</h3>
            <span
              class="sure"
              @click="closeField"
            >确定</span>
          </div>
          <van-checkbox-group v-model="fieldValue">
            <van-cell-group>
              <van-cell
                v-for="(oneField, index) in fieldArr"
                clickable
                :key="index"
                :title="oneField"
                @click="toggle(index)"
              >
                <van-checkbox
                  :name="oneField"
                  ref="checkboxes"
                  slot="right-icon"
                />
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </van-popup>

        <!-- 城市选择 -->
        <van-popup
          class="industryDiv"
          v-model="cityShow"
          position="bottom"
          :style="{ minHeight: '30%' }"
        >
          <van-area
            title="城市"
            :area-list="areaList"
            @confirm="sureArea"
          />
        </van-popup>
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="registerDiv">
      <!-- <span
        class="registerBtn"
        @click="submitInfo"
      >立即注册</span> -->
      <van-button
        type="default"
        class="registerBtn"
        @click="submitInfo"
        :disabled="isDisable"
      >立即注册</van-button>
      <span class="phone">咨询电话：010-53328239</span>
    </div>
    <!-- <div class="contactDiv">
      <span>咨询电话：010-53328239</span>
    </div> -->
  </div>
</template>
<script>
// 引入城市静态数据(vant)
import areaList from '@/resource/js/area';
import { getRegisterVerify, apply } from '@/api/index';

import Vue from 'vue';
import { Toast, Dialog } from 'vant';

Vue.use(Toast);
// 全局注册
Vue.use(Dialog);
export default {
  data() {
    return {
      areaList: areaList,
      result: null,
      tel: '',
      text: '',
      message: '',
      industryShow: false,
      fieldShow: false,
      cityShow: false,
      industryArr: [
        '旅客票务代理',
        '商务代理代办服务',
        '旅行社及相关服务',
        '其他贸易经纪与代理',
        '其他互联网服务',
        '其他科技推广'
      ],
      industryName: '',
      fieldValue: [],
      checkedField: [],
      formInfo: {
        name: '', //企业名称
        industryCode: null,
        address: '',
        province: '',
        city: '',
        area: '',
        contact: '',
        contactPhone: '',
        contactEmail: '',
        remark: '',
        subdivisionField: '', //细分领域，逗号隔开
        channel: 1, //1，优品三悦  2，执惠  3，泰坦云 4,小微平台
        source: 1 // 1:h5 2:pc
      },
      fieldArr: [
        '省、市、县相关单位',
        '央企、省、市旅投团',
        '景区管委会',
        '旅行社/OTA服务商',
        '包（租）车公司、包房商、包机',
        '票务代理商、门票批发、定制游、行程定制等服务商',
        'TMC商旅管理、差旅管理等技术和服务提供商',
        '旅游营销、旅游消费服务商、旅游金融服务商',
        'MICE会议和展览'
      ],
      isDisable: false
    };
  },
  computed: {
    fieldCompu() {
      return this.fieldValue.join(',');
    }
  },
  mounted() {
    this.formInfo.channel =
      this.$route.params.channel && this.$route.params.channel <= 3
        ? this.$route.params.channel
        : 1;
    console.log(this.formInfo.channel);
  },
  methods: {
    async verificationInfo() {
      let flag = true;
      const MobileRegex = /^1(3|4|5|6|7|8|9)\d{9}$/;
      // const emailRegex = /^\w+([-+.]\w+)*@\w+([-.]\\w+)*\.\w+([-.]\w+)*$/;
      // const emailRegex1 = new RegExp(
      //   '^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$'
      // );
      const emailRegex2 = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      const enterpriseRegex = /(?!\d+$)[\dA-Za-z\u4e00-\u9fa5]{1,50}/;
      if (
        !this.formInfo.name ||
        !this.formInfo.industryCode ||
        this.fieldValue.length < 1 ||
        !this.formInfo.province ||
        !this.formInfo.city ||
        !this.formInfo.area ||
        !this.formInfo.contact ||
        !this.formInfo.contactPhone ||
        !this.formInfo.contactEmail
      ) {
        Toast('必填项不能为空');
        flag = false;
        return false;
      }
      if (!enterpriseRegex.test(this.formInfo.name)) {
        Toast('企业名称不支持纯数字，最多50个字符');
        flag = false;
        return false;
      }
      if (!MobileRegex.test(this.formInfo.contactPhone)) {
        Toast('请输入正确的手机格式');
        flag = false;
        return false;
      }
      if (!(await this.checkoutPhone())) {
        flag = false;
        return false;
      }
      if (!emailRegex2.test(this.formInfo.contactEmail)) {
        Toast('请输入正确的邮箱格式');
        flag = false;
        return false;
      }
      if (!(await this.checkoutEmail())) {
        flag = false;
        return false;
      }

      return flag;
    },
    async checkoutPhone() {
      const MobileRegex = /^1(3|4|5|6|7|8|9)\d{9}$/;
      if (MobileRegex.test(this.formInfo.contactPhone)) {
        let flag = true;
        await getRegisterVerify(`phone=${this.formInfo.contactPhone}`).then(
          res => {
            if (res.data.code == 600) {
              Toast('该手机号已注册');
              flag = false;
            }
          }
        );
        return flag;
      }
    },
    async checkoutEmail() {
      // const emailRegex1 = new RegExp(
      //   '^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$'
      // );
      const emailRegex2 = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

      if (emailRegex2.test(this.formInfo.contactEmail)) {
        let flag = true;
        await getRegisterVerify(`email=${this.formInfo.contactEmail}`).then(
          res => {
            if (res.data.code == 600) {
              Toast('该邮箱已被使用，请输入其他邮箱');
              flag = false;
            }
          }
        );
        return flag;
      }
    },
    async submitInfo() {
      this.formInfo.subdivisionField = this.checkedField.join(',');
      const data = this.formInfo;
      if (!(await this.verificationInfo())) {
        return false;
      }
      this.isDisable = true;
      apply(data).then(res => {
        if (res.data.code == 200) {
          Dialog.alert({
            message: '提交成功',
            confirmButtonText: '我知道了'
          }).then(() => {
            this.isDisable = false;
            const arr = Object.keys(this.formInfo);
            arr.forEach(item => {
              this.formInfo[item] = '';
            });
            this.industryName = '';
            this.fieldValue = [];
            this.checkedField.length = [];
          });
        } else {
          this.isDisable = false;
        }
      });
    },
    sureArea(val) {
      this.cityShow = false;
      this.formInfo.province = val[0].name;
      this.formInfo.city = val[1].name;
      this.formInfo.area = val[2].name;
      this.formInfo.address = val[0].name + val[1].name + val[2].name;
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    closeField() {
      this.checkedField = [];
      for (let i = 0; i < this.fieldArr.length; i++) {
        for (let j = 0; j < this.fieldValue.length; j++) {
          if (this.fieldArr[i] == this.fieldValue[j]) {
            this.checkedField.push(i + 1);
          }
        }
      }
      this.fieldShow = false;
    }
  }
};
</script>
<style lang="scss">
.van-dialog {
  .van-button__text {
    color: #15346a;
  }
  .van-dialog__content {
    .van-dialog__message {
      font-size: 0.34rem;
      color: #333;
    }
  }
}

.wrapper {
  .van-checkbox__icon--round .van-icon {
    border-radius: 6px;
  }
  .van-checkbox__icon--checked .van-icon {
    color: #fff;
    background-color: #0b2249;
    border-color: #0b2249;
    border-radius: 6px;
  }
  .van-hairline--top-bottom::after,
  .van-hairline-unset--top-bottom::after {
    border-width: 0;
  }
  .van-area {
    .van-picker__toolbar {
      .van-picker__title {
        color: #fff;
      }
    }
    // border-radius: 0.2rem 0.2rem 0px 0px;
    .van-picker__toolbar {
      background-color: #0b2249;
      border-radius: 0.2rem 0.2rem 0px 0px;
    }
    .van-picker__cancel,
    .van-picker__confirm {
      color: #fff;
    }
  }
  .industryDiv.van-popup {
    background: transparent;
    border-radius: 0.2rem 0.2rem 0px 0px;
  }
  .textDiv {
    .van-cell {
      display: flex;
      flex-direction: column;
    }
    .van-field__body {
      padding-top: 0.2rem;
    }
    textarea {
      line-height: 0.3rem;
    }
    textarea::-webkit-input-placeholder {
      font-size: 0.2rem;
      color: #bbbfc8;
      line-height: 0.3rem;
    }
    textarea:-moz-placeholder {
      font-size: 0.2rem;
      color: #bbbfc8;
      line-height: 0.3rem;
    }
    input:-ms-input-placeholder {
      font-size: 0.26rem;
      color: #bbbfc8;
      line-height: 0.36rem;
    }
    input::-webkit-input-placeholder {
      font-size: 0.26rem;
      color: #bbbfc8;
      line-height: 0.36rem;
    }
    input:-moz-placeholder {
      font-size: 0.26rem;
      color: #bbbfc8;
      line-height: 0.36rem;
    }
    input:-ms-input-placeholder {
      font-size: 0.26rem;
      color: #bbbfc8;
      line-height: 0.36rem;
    }
    .van-cell {
      display: flex;
      flex-direction: column;
    }
  }
  .van-cell {
    background-color: transparent;
    .van-field__label {
      font-family: PingFang-SC-Regular;
      font-size: 0.26rem;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #282d37;
    }
  }
}
</style>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.wrapper {
  .industryDiv {
    .header {
      width: 100%;
      height: 0.84rem;
      background-color: #0b2249;
      padding: 0 0.3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .cancel,
      .sure {
        font-size: 0.28rem;
        color: #fff;
      }

      h3 {
        flex: 1;
        // width: 100%;
        height: 0.84rem;
        font-size: 0.28rem;
        color: #ffffff;
        line-height: 0.84rem;
        text-align: center;
        background-color: #0b2249;
        border-radius: 0.2rem 0.2rem 0px 0px;
      }
    }

    ul {
      width: 100%;
      height: max-content;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      li {
        width: 100%;
        height: 0.98rem;
        font-size: 0.26rem;
        color: #282d37;
        border-bottom: 1px solid #f1f3f7;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .active {
        color: #15346a;
      }
      & > :last-child {
        border-bottom: 0;
      }
    }
  }
  .topDiv {
    width: 100%;
    height: 3.98rem;
    background: #dbeaff url(../assets/bg1.png) center no-repeat;
    background-size: 100% 100%;
    padding: 0.3rem;
    .icon {
      display: flex;
      justify-content: flex-start;
      span {
        width: 1.65rem;
        height: 0.45rem;
        background: url(../assets/icon.png) center no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .contentDiv {
    z-index: 22;
    width: 100%;
    padding: 0 0.3rem;
    margin-top: -1.2rem;
    position: absolute;
    top: 3.98rem;
    .content {
      width: 100%;
      height: 10.06rem;
      // height: max-content;
      background-color: #ffffff;
      box-shadow: inset 0px 0.1rem 0.24rem 0px rgba(88, 152, 247, 0.6);
      border-radius: 0.2rem;
      .form-ul {
        padding: 0.1rem;
        li {
          width: 100%;
          height: 1rem;
          padding: 0.2rem;
          border-bottom: 1px solid #f1f3f7;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .title {
            flex: 1;
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
          span {
            width: 1.4rem;
            text-align: left;
            color: #282d37;
            font-size: 0.26rem;
          }
          .spe::after {
            position: absolute;
            color: #ee0a24;
            font-size: 14px;
            content: '*';
          }
          input {
            flex: 1;
            margin-left: 0.3rem;
            font-size: 0.28rem;
          }
          b {
            margin-left: 5px;
            color: #969799;
            min-width: 1em;
            font-size: 16px;
            position: relative;
            display: inline-block;
            font: normal normal normal 18px/1 'vant-icon';
            text-rendering: auto;
            -webkit-font-smoothing: antialiased;
          }
          b::before {
            content: '\F00A';
          }
        }
      }
    }
  }
  .registerDiv {
    width: 100%;
    height: 3.34rem;
    background: #fff url(../assets/bg2.png) center no-repeat;
    background-size: 100% 100%;
    // margin-top: -1.2rem;
    position: absolute;
    left: 0;
    // bottom: -2rem;
    // bottom: -14%;
    // top: 90%;
    top: 11.84rem;
    display: flex;
    justify-content: center;
    // align-items: flex-end;
    align-items: center;
    flex-direction: column;
    padding-top: 1rem;
    .phone {
      font-size: 0.28rem;
      color: #1e4fa3;
    }
    .registerBtn {
      // margin-bottom: 0.77rem;
      margin-bottom: 0.47rem;
      width: 4rem;
      height: 0.88rem;
      text-align: center;
      line-height: 0.88rem;
      text-align: center;
      font-size: 0.3rem;
      color: #ffffff;
      background-image: linear-gradient(
          0deg,
          #183d8a 0%,
          #617db6 51%,
          #9bb0da 100%
        ),
        linear-gradient(#adb2bd, #adb2bd);
      background-blend-mode: normal, normal;
      border-radius: 0.44rem;
    }
  }
  .contactDiv {
    position: absolute;
    // bottom: -2.5rem;
    // bottom: -18%;
    width: 100%;
    height: 0.8rem;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 120%;
    span {
      font-size: 0.28rem;
      color: #1e4fa3;
    }
  }
}
</style>
