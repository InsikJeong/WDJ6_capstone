import React, {useContext, useState, useEffect} from 'react';
import Styled from 'styled-components/native';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';

import IconButton from '~/Components/IconButton';
import Button from '~/Components/Button';

import {
  FlatList, Platform, Alert, Modal,
  PermissionsAndroid, AppState, StatusBar,
  NativeModules, NativeEventEmitter,} from 'react-native';

import {DrivingDataContext} from '~/Contexts/DrivingData';
import {UserContext} from '~/Contexts/User';

import Geolocation from 'react-native-geolocation-service';
import Sound from 'react-native-sound';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import { getBottomSpace } from 'react-native-iphone-x-helper';

import ReactInterval from 'react-interval';
import LottieView from 'lottie-react-native';

const audioList = [
  {
    title: 'fast', // 0
    isRequire: true,
    url: require('./fast_detect.mp3')
  },
  {
    title: 'sleep', // 1 
    isRequire: true,
    url: require('./sleep_detect.mp3')
  },
  {
    title: 'slow', // 2
    isRequire: true,
    url: require('./slow_detect.mp3')
  },
  {
    title: 'sago', // 3
    isRequire: true,
    url: require('./sago.mp3')
  },
  {
    title: 'auto_singo', // 4
    isRequire: true,
    url: require('./auto_singo.mp3')
  },
  {
    title: 'singo_req', // 5
    isRequire: true,
    url: require('./singo_req.mp3')
  },
  {
    title: 'cancel', // 6
    isRequire: true,
    url: require('./cancel.mp3')
  },
  {
    title: 'singogo', // 7
    isRequire: true,
    url: require('./singogo.mp3')
  },
  {
    title: 'lookfront_eye', // 8
    isRequire: true,
    url: require('./lookfront_eye.mp3')
  },
  {
    title: 'i119', // 9
    isRequire: true,
    url: require('./i119.mp3')
  },
]

const audioListNew = [
  {
    title: 'real_singo', // 0
    isRequire: true,
    url: require('./real_singo.mp3')
  }
]

const NewTextViewData = Styled.View``;
const NewTextViewRow = Styled.View`
  flex-direction: row;
`;

const NewTextViewRow30 = Styled.View`
  width: 30%;
`;
const NewTextViewRow40 = Styled.View`
  width: 40%;
`;
const NewTextViewRow60 = Styled.View`
  width: 60%;
`;

const NewTextRight = Styled.Text`
  font-size: 20px;
  text-align: right;
`;
const NewTextCenter = Styled.Text`
  font-size: 20px;
  text-align: center;
`;
const NewTextLeft = Styled.Text`
  font-size: 20px;
  text-align: left;
`;
const NewTextColor = Styled.Text`
  font-size: 20px;
`;

const Text = Styled.Text`
  font-size: 20px;
`;
const MapInfoTouchableOpacity = Styled.TouchableOpacity`
`;
const TopLeftView = Styled.View`
  position: absolute;
  background-color: #FFFFFFDD;
  border-color: #00F;
  border-width: 2px;
  border-radius: 16px;
  top: 1%;
  left: 2%;
  width: 60%;
  padding: 4% 0;
`;
const TopLeftPadding = Styled.View`
  padding: 0 10%;
`;
const TopLeftViewTouch = Styled.View`
  flex: 1;
`;
const TopRightView = Styled.View`
  position: absolute;
  background-color: #FFFFFF;
  border-radius: 25px;
  border-width: 1px;
  border-color: #AAA;
  top: 1%;
  right: 2%;
  width: 50px;
  height: 50px;
`;

const CenterRightView = Styled.View`
  position: absolute;
  right: 2%;
  top: 46%;
  width: 40px;
  height: 12%;
`;
const CenterTestTestRightView = Styled.View`
  position: absolute;
  right: 2%;
  top: 16%;
  width: 40px;
  height: 12%;
`;
const CenterTestRightView = Styled.View`
  position: absolute;
  right: 2%;
  top: 30%;
  width: 40px;
  height: 12%;
`;

const BottomLeftViewGPS = Styled.View`
  position: absolute;
  background-color: #FFFFFF;
  border-radius: 25px;
  border-width: 1px;
  border-color: #AAA;
  bottom: 2%;
  left: 2%;
  width: 50px;
  height: 50px;
`;
const BottomLeftViewEye = Styled.View`
  position: absolute;
  background-color: #FFFFFF;
  border-radius: 25px;
  border-width: 1px;
  border-color: #AAA;
  bottom: 2%;
  left: 4%;
  margin-left: 50px;
  width: 50px;
  height: 50px;
`;
const BottomRightView = Styled.View`
  position: absolute;
  background-color: #FFFFFF;
  border-radius: 10px;
  border-width: 2px;
  border-color: #AAA;
  bottom: 2%;
  right: 2%;
  width: 100px;
  height: 50px;
  justify-content: center;
  align-items: center;
`;
const Btn = Styled.TouchableOpacity`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const BtLabel = Styled.Text`
  font-size: 22px;
  font-weight: 900;
`;

const SingoTextView = Styled.View`
  width: 100%;
  padding-top: 16px;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF;
`;
const SingoText = Styled.Text`
  font-size: 28px;
`;
const SingoTextCount = Styled.Text`
  padding-top: 8px;
  padding-bottom: 8px;
  font-size: 50px;
  color: #FF0000;
`;
const LottieViewMyView = Styled.View`
  width: 100%;
  height: 40%;
  padding: 100px;
`;
const ModalView = Styled.View`
  background-color: #FFFFFF;
  width: 96%;
  height: 66%;
  marginTop: 30%;
  marginLeft: 2%;
  marginRight: 2%;

  border-width: 8px;
  border-radius: 8px;
  border-color: #FF0000;

  justify-content: center;
  align-items: center;

`;
const TouchableOpacity = Styled.TouchableOpacity`
  align-items: center;
`;
const TouchableOpacityView = Styled.View`
  background-color: #FFFFFF;
  justify-content: center;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);

  border-width: 3px;
  border-color: #FF0000;
  border-radius: 10px;

`;
const ReportCancelBtn = Styled.Text`
  font-size: 40px;
  text-align: center;
  font-weight: 900;
  
  background-color: #FF0000;
  color: #FFFFFF;
  padding: 5px;
`;

// ------------- sleep modal ------------
const SleepModalView = Styled.View`
  flex: 1;
  width: 70%;
  margin-left: 15%;
  justify-content: center;
  align-items: center;
`;
const SleepModalImageTextView = Styled.View`
  padding: 16px;
  background-color: #FFFFFF;
  border-width: 8px;
  border-radius: 8px;
  border-color: #FF0000;
  align-items: center;
`;
const SleepAlertImage = Styled.Image`
`;
const SleepAlertText = Styled.Text`
  margin-top: 8px;
  font-size: 32px;
  font-weight: 900;
`;
// ------------- sleep modal ------------
// ------------- start, save modal ------------
const ModalViewBack = Styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #00000055;
`;
const DrivingStartSaveModalView = Styled.View`
  background-color: #FFFFFF;
  width: 72%;
  height: 51%;
  marginTop: 45%;
  marginLeft: 14%;
  marginRight: 14%;
  
  border-width: 4px;
  border-radius: 32px;
  
  justify-content: center;
  align-items: center;
  `;
const LottieStartSaveView = Styled.View`
  width: 100%;
  height: 40%;
  padding: 100px;
`;
const DrivingStartSaveTextView = Styled.View`
  width: 100%;
  padding-top: 16px;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF;
`;
const DrivingStartSaveText = Styled.Text`
  font-size: 32px;
  font-weight: bold;
`;

// ------------- start, save modal ------------
// ------------- report_ok modal ------------
const ReportOkModalView = Styled.View`
  background-color: #FFFFFF;
  width: 96%;
  height: 66%;
  marginTop: 30%;
  marginLeft: 2%;
  marginRight: 2%;

  border-width: 8px;
  border-radius: 8px;
  border-color: #FF0000;

  justify-content: center;
  align-items: center;
`;
const ReportOKImage = Styled.Image`
  width: 100%;
  height: 100%;
`;
const ReportOKText = Styled.Text`
  margin-top: 8px;
  font-size: 28px;
  font-weight: 600;
`;
const ReportOKText2 = Styled.Text`
  margin-top: 16px;
  font-size: 36px;
  font-weight: 800;
`;
const ReportTouchableOpacity = Styled.TouchableOpacity`
  width: 80%;
  height: 60%;
`;

// ------------- report_ok modal ------------
interface IGeolocation {
  latitude: number;
  longitude: number;
}

interface ICoordinate {
  latitude: number;
  longitude: number;
  speed: number | null;
  timestamp: any;
}

interface ILatLng {
  latitude: number;
  longitude: number;
}

interface ICamera {
  center: ILatLng;
  heading: number;
  pitch: number;
  zoom: number;
  altitude: number;
}
interface ILocation {
  latitude: number;
  longitude: number;
}

type TypeDrawerProp = DrawerNavigationProp<DrawNaviParamList, 'MainTabNavi'>;
interface DrawerProp {
  navigation: TypeDrawerProp;
}

const MapData = ({navigation}: DrawerProp) => {
  // ??????????????? ???????????? ??????
  const androidPermissionLocation = () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => { // check
        if (result) {
          console.log("android LOCATION check OK");
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => { // request
            if (result) {
              console.log("android LOCATION request Ok");
            } else {
              console.log("android LOCATION reject");
            }
          });
        }
      });
    } else if (Platform.OS === 'ios') {
      // Alert.alert('PermissionLocation, Android only');
    }
  };

  const face = (num:number) :string => {
    if(num==0) return " ";
    if(num==10) return "??????";
    if(num==20) return " ??? ";
    if(num==30) return " ??? ";
    return "";
  }
  const eyePoint = (num:number) :string => {
    if(num==0) return "X";
    if(num==1) return "On";
    if(num==2) return "Off";
    return "";
  }
  
  const {
    drivingSaveData, setDrivingSaveData,
    drivingStart, drivingMarkerSave, drivingSave,
    linkInfo, setLinkInfo,
    defaultInfo, setDefaultInfo,
    checkInfo, setCheckInfo
  } = useContext(DrivingDataContext);

  const {userInfo2} = useContext<IUserContext>(UserContext);
  
  const [marginTop, setMarginTop] = useState<number>(1);
  const [infoTouch, setInfoTouch] = useState<boolean>(false);

  const [linkInfo_4Cnt, setLinkInfo_4Cnt] = useState<number>(0);
  const [linkInfo_5Cnt, setLinkInfo_5Cnt] = useState<number>(0);

  const [onSave, setOnSave] = useState<boolean>(false);
  const [onPolyline, setOnPolyline] = useState<boolean>(false);
  const [onMarker, setOnMarker] = useState<boolean>(false);
  const [driving, setDriving] = useState<boolean>(false);

  // MapMarker Point
  const [_startTime, _setStartTime] = useState<number>(0);
  const [_endTime, _setEndTime] = useState<number>();
  // MapMarker Point

  const [coordinate, setCoordinate] = useState<ICoordinate>({
    latitude: 0.0000,
    longitude: 0.0000,
    speed: 0.0000,
    timestamp: 0,
     // Milliseconds since Unix epoch ?????????
  });
  const [coordinate2, setCoordinate2] = useState<ICoordinate>({
    latitude: 0.0000,
    longitude: 0.0000,
    speed: 0.0000,
    timestamp: 0, // Milliseconds since Unix epoch
  });

  const [camera, setCamera] = useState<ICamera>({
    center: {
      latitude: 35.896311,
      longitude: 128.622051
    },
    heading: 0,
    pitch: 0,
    zoom: 15,
    altitude: 0
  });

  const [locations, setLocations] = useState<Array<IGeolocation>>([]);
  // ???????????? locations
  const [markerLocations, setMarkerLocations] = useState<Array<IMarkerlocation>>([]);

  let sound1: Sound;

  const [modalVisibleSleep, setModalVisibleSleep] = useState(false);
  const [modalVisibleReportCount, setModalVisibleReportCount] = useState(false);

  const [modalVisibleStart, setModalVisibleStart] = useState(false);
  const [modalVisibleSave, setModalVisibleSave] = useState(false);

  const [modalVisibleReportOk, setModalVisibleReportOk] = useState(false);

  const [soundReal, setSoundReal] = useState(
    new Sound(audioListNew[0].url, (error) => {})
  );

  const [interPlus, setInterPlus] = useState<boolean>(false);
  const [interMinus, setInterMinus] = useState<boolean>(false);
  const [pushNum, setPushNum] = useState<number>(0);

  useEffect(() => { 
    androidPermissionLocation();

    // //## ????????????
    // setCheckInfo([-1,-1,-1, 1 ,-1,-1,-1,-1,-1,-1,-1]);
    // ## ????????????
    // setLinkInfo([-1,-1,-1, 151, 10, 1,-1, 0, 0,-1]);
    console.log("--- --- MapData Mount");
    return () => {
      console.log("--- --- MapData return");
    };
  },[]);

  // ?????? ?????? ... 
  let linkInfo_ = ():void => {
    // console.log(checkInfo);
    // console.log(linkInfo);
    if(driving){ // ???????????? ??????

      if(checkInfo[11] == 11 && checkInfo[3] == 1){
        let _checkInfo = [...checkInfo];
        _checkInfo[4] += 1; // ???????????? ???
        console.log("?????? ?????? ?????????",checkInfo[4]);
        setCheckInfo(_checkInfo);

        if(checkInfo[3] == 1 && checkInfo[4] == 0){
          // ??????????????? ?????? ??????
          sound1 = new Sound(audioList[5].url, (error) => {
            if(error){
              return;
            } else {
              sound1.play((success)=>{
                sound1.release();
              })
            }
          });
        }

        // ????????? ?????? ??????
        setModalVisibleReportCount(true);
      }

      // ??????????????? ???????????????, ???????????? ?????????
      // ?????????????????? ?????????, ????????? ??? ??????
      if(checkInfo[4] >= 10){
        let _checkInfo = [...checkInfo];
        console.log("?????? ?????? ????????? ?????? !!", checkInfo[4]);
        console.log(_checkInfo[4]);
        _checkInfo[3] = 0; // ?????????????????? ?????????
        _checkInfo[4] = 0;
        _checkInfo[5] = 1; // ?????????????????? ??????
        setCheckInfo(_checkInfo);

        // ????????? ?????? ??????
        setModalVisibleReportCount(false);

        // ????????? ?????? ??????
        // if(checkInfo[5] == 1){ ?????? ?????? ??????
        console.log("?????? ?????? ?????? !! ?????? ??????");
        // ????????????, ?????? ????????? ?????? 5~10???
        setTimeout(() => {
          sound1 = new Sound(audioList[7].url, (error) => {
            if(error){
              return;
            } else {
              sound1.play((success)=>{
                sound1.release();
              })
            }
          });
          setTimeout(() => {
            setModalVisibleReportOk(true);
            setTimeout(() => {
              setModalVisibleReportOk(false);
            }, 14000);
            if(soundReal){
              // ????????????
              soundReal.play();
            }
          }, 2000);
        }, 1000);
        console.log("?????? ????????? ?????? ????????? ???????????????");

        let _checkInfo2 = [...checkInfo];
        console.log(_checkInfo2);
        _checkInfo2[0] = 0; // ?????? ??????
        _checkInfo2[1] = 1; // ?????? ??????
        _checkInfo2[2] = 0; // ???????????? ?????????
        _checkInfo2[3] = 0; // ?????? ???????????? ?????????
        _checkInfo2[4] = 0; // ?????? ????????? ?????????
        _checkInfo2[5] = 0; // ?????? ???????????? ?????????
        _checkInfo2[6] = 0; // ?????????
        _checkInfo2[7] = 0; // ?????????
        _checkInfo2[8] = 0; // ?????????
        _checkInfo2[9] = 0; // ?????????
        setCheckInfo(_checkInfo2);
        setLinkInfo([-1,-1,-1, -1,  -1,-1,-1, 0, 0,-1]);
        console.log(_checkInfo2);
        console.log("?????? ????????? ?????? ????????? ???????????????");

        let reportCheckId = false;
        if(onSave && userInfo2 && userInfo2.key){
          if(userInfo2.key != -1 && userInfo2.key != undefined){
            if(userInfo2.key >= 3){
              reportCheckId = true;
            }
          }
        }
        let {latitude, longitude, timestamp} = coordinate2;
        let _markerLocation = {
          latitude,
          longitude,
          bool_report: reportCheckId,
          bool_sudden_acceleration: false,
          bool_sudden_stop: false,
          bool_sleep: false,
          timestamp, // ?????? ???????????? ?????????
        }
        console.log(_markerLocation);
        console.log(markerLocations.length);
        // ????????? ?????????
        setMarkerLocations([...markerLocations, _markerLocation]);
        if(onSave && userInfo2 && userInfo2.key){
          if(userInfo2.key != -1 && userInfo2.key != undefined){
            // ????????? ???????????? ????????? ????????? ?????????
            console.log(_markerLocation);
            drivingMarkerSave(_markerLocation);
          }
        }

        let _drivingSaveData = Object.assign({}, drivingSaveData);
        let _endT = new Date().getTime();
        _setEndTime(() => _endT);
        // console.log(locations);

        if(locations){
          if(userInfo2 && userInfo2.key){
            _drivingSaveData.webUserId = userInfo2.key;
          }
          if(userInfo2 && userInfo2.name){
            _drivingSaveData.Drivingline = locations;
            _drivingSaveData.name = userInfo2.name;
            _drivingSaveData.startTime = _startTime;
            _drivingSaveData.endTime = _endT;
          }
          if(markerLocations != undefined){
            if(markerLocations.length > 1){
              console.log("???????????? ????????????");
              _drivingSaveData.DrivingMarker = markerLocations;
            }
          }
          if(_drivingSaveData.endTime && _drivingSaveData.startTime){
            if(_drivingSaveData.endTime-_drivingSaveData.startTime > 500){
              console.log("????????? ???????????????");
              drivingSave(_drivingSaveData); // ?????? ?????? ?????? 4????????? ???
            }
          }
        }

        // ??????????????? ????????? ??????
        let _defaultInfo = [...defaultInfo];
        _defaultInfo[4] = 0;
        setDefaultInfo(_defaultInfo);
        // ??????????????? ????????? ??????
        
        setDrivingSaveData(undefined);
        setLocations([]); // ?????????
        setMarkerLocations([]);
        setDriving(false); // ??????
        setOnSave(false); // ??????
        console.log("!!!!!!!!!!!!!!!! ?????? ???????????? !!!!!!!!!!!!!!!!!!!!!");
      }
      // ????????? 10 ?????? ???
      // ?????? ?????? ?????? ????????? (?????? ??????, ?????? ?????????, ??????????????? ??????, ????????? ??????)
    }
    
    // ?????? ???????????? ??? ?????? ????????? ??????
    if(checkInfo[5] == 1){
      console.log("check Info 5??? 1?????????");
    }
  }

  let linkInfo_0 = ():void => {
    if(driving){ // ???????????? ??????
      if(linkInfo[0] == 119 && checkInfo[3] != 1 && checkInfo[10]!=119){ // ???????????? ?????? ??????
        // ???????????? on??????, ???????????? off??????, ???????????????????????? no??????
        let _checkInfo = [...checkInfo];

        // ?????? ????????? ???????????? ???????????? ????????????, ????????? ?????????
        _checkInfo[2] = 1; // ???????????? ???
        _checkInfo[3] = 1; // ???????????? ???
        _checkInfo[10] = 119; // ?????? ?????? 1?????? ??????
        _checkInfo[11] = 11;
        setCheckInfo(_checkInfo);
      }

      if(linkInfo[0] == 77 && checkInfo[3] == 1){ // ???????????? ?????? ??????
        // ???????????? on??????, ???????????? on??????, ???????????? on??????
        let _checkInfo = [...checkInfo];

        if(_checkInfo[3]!=0){
          // ??????????????? ??????
          sound1 = new Sound(audioList[6].url, (error) => {
            if(error){
              return;
            } else {
              sound1.play((success)=>{
                sound1.release();
              })
            }
          });
        }

        _checkInfo[2] = 0; // ???????????? ??????
        _checkInfo[3] = 0; // ???????????? ??????
        _checkInfo[4] = 0; // ?????? ????????? ?????????
        _checkInfo[10] = 0; // ?????? ?????? 1?????? ??????
        _checkInfo[11] = 11;
        setCheckInfo(_checkInfo);
      }
      // ????????????????????? ?????? ???????????? ?????????????????? ?????????
    }
  }

  let linkInfo_3 = ():void => {
    if(driving){ // ???????????? ??????
      if(checkInfo[2] != 1){ // ?????? ?????? ??????
        if(linkInfo[3] != -1 && linkInfo[3] != 0){ // ????????? ???????????? ????????????????????? ??????
          if(!(50 <= linkInfo[3] && linkInfo[3] <= 150)){ // ?????????????????? ??????
            console.log("????????? ??????");
              // ?????? ??????
            let _checkInfo = [...checkInfo];
            _checkInfo[2] = 1;
            _checkInfo[3] = 1;
            setCheckInfo(_checkInfo);
          }
        }
      }
    }
  };

  let linkInfo_4 = ():void => {
    if(driving){ // ???????????? ??????
      // if(checkInfo[9] != 1){ // ???????????? ?????? ??????
        if(linkInfo[4] != -1){ // ?????? ???????????? ????????? ??????
          if(linkInfo[4] == 30 || linkInfo[4] == 20){
            setLinkInfo_4Cnt((linkInfo_4Cnt)=>{
              return (
                linkInfo_4Cnt+1
              );
            });
            console.log("?????? ??????", linkInfo_4Cnt);
            if(linkInfo_4Cnt > 6){
              // ?????? ?????????
              setLinkInfo_4Cnt(0);
              // ?????? ?????? ?????????
              sound1 = new Sound(audioList[8].url, (error) => {
                if(error){
                  return;
                } else {
                  sound1.play((success)=>{
                    sound1.release();
                  })
                }
              });
            }
          } else if( linkInfo[4] == 10 ){
            // ???????????? ??????
            console.log("?????? ?????? ??????", linkInfo_4Cnt);
            if(linkInfo_4Cnt>1){
              setLinkInfo_4Cnt((linkInfo_4Cnt)=>{
                return (
                  linkInfo_4Cnt -= 2
                );
              });
            }
            if(linkInfo_4Cnt<0){
              setLinkInfo_4Cnt((linkInfo_4Cnt)=>{
                return (
                  linkInfo_4Cnt = 0
                );
              });
            }
          } else {

          } // 
        } // ??????
      // } // ??????
    } // ??????
  }

  let linkInfo_5 = ():void => {
    if(driving){ // ???????????? ??????
      // if(checkInfo[8] != 1){ // ?????? ?????? ??????
        if(linkInfo[5] != -1){ // ??? ?????? ???????????? ????????? ??????
          if(linkInfo[5] == 2){ // ?????? ??????????????? ??????
            setLinkInfo_5Cnt((linkInfo_5Cnt)=>{
              return (
                linkInfo_5Cnt+1
              );
            });
            console.log(">> ?????? ??????", linkInfo_5Cnt);
            if(linkInfo_5Cnt > 6){
              // ?????? ?????????
              setLinkInfo_5Cnt(0);
              
              // ????????????
              sound1 = new Sound(audioList[9].url, (error) => {
                if(error){
                  return;
                } else {
                  sound1.play((success)=>{
                    sound1.release();
                  })
                }
              });
              setModalVisibleSleep(true);
              setTimeout(() => {
                setModalVisibleSleep(false);
              }, 2000);

              let {latitude, longitude, timestamp} = coordinate2;
              let _markerLocation = {
                latitude,
                longitude,
                bool_report: false,
                bool_sudden_acceleration: false,
                bool_sudden_stop: false,
                bool_sleep: true,
                timestamp, // ?????? ???????????? ?????????
              }
              console.log(_markerLocation);
              console.log(markerLocations.length);
              // ????????? ?????????
              setMarkerLocations([...markerLocations, _markerLocation]);
              if(onSave && userInfo2 && userInfo2.key){
                if(userInfo2.key != -1 && userInfo2.key != undefined){
                  // ????????? ???????????? ????????? ????????? ?????????
                  console.log(_markerLocation);
                  drivingMarkerSave(_markerLocation);
                }
              }

            }
          } else if (linkInfo[5] == 1){
            // ?????? ??????
            console.log(">> ?????? ??????", linkInfo_5Cnt);
            if(linkInfo_5Cnt>1){
              setLinkInfo_5Cnt((linkInfo_5Cnt)=>{
                return (
                  linkInfo_5Cnt -= 2
                );
              });
            }
            if(linkInfo_5Cnt<0){
              setLinkInfo_5Cnt((linkInfo_5Cnt)=>{
                return (
                  linkInfo_5Cnt = 0
                );
              });
            }
          } else {
            // console.log(" 11 ????????? 22 ?????? ??????");
          }
        }
      // }
    }
  }

  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{flex: 1, marginTop}}
        loadingEnabled={true}

        showsUserLocation={true}
        
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        showsCompass={false}
        showsScale={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={true}

        camera={camera}
        onUserLocationChange={ e => {
          if(onSave){
            const {latitude, longitude} = e.nativeEvent.coordinate;
            setLocations([...locations, {latitude, longitude}]);

            setCoordinate2({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
              speed: e.nativeEvent.coordinate.speed,
              // timestamp: e.nativeEvent.coordinate.timestamp,
              timestamp: new Date(),
            });

            setCamera( camera => {
              return ({
                center: {
                  latitude: latitude,
                  longitude: longitude
                },
                heading: 0,
                pitch: 0,
                zoom: camera.zoom,
                altitude: 0
              });
            });
          }
        }}
      >
        {onSave && onPolyline && (<Polyline
          coordinates={locations}
          strokeWidth={3}
          strokeColor="#00F" 
        />)}
        {onSave && onMarker && markerLocations.map((markerLocation: ILocation, index: number) => (
          <Marker
            key={`markerLocation-${index}`}
            coordinate={{
              latitude: markerLocation.latitude,
              longitude: markerLocation.longitude,
            }}
          />
        ))}
        
      </MapView>
        <ReactInterval
          timeout={1000}
          enabled={driving}
          callback={() => {
            linkInfo_();
            linkInfo_0();
            linkInfo_3();
            linkInfo_4();
            linkInfo_5();
          }}
        />
        {interPlus && (
          <ReactInterval
            timeout={30}
            enabled={interPlus}
            callback={() => {
              console.log("??????", pushNum);
              if(pushNum<80) setPushNum(pushNum+2);
            }}
          />
        )}

        {interMinus && (
          <ReactInterval
            timeout={30}
            enabled={interMinus}
            callback={() => {
              console.log("??????", pushNum);
              if(pushNum>20) setPushNum(pushNum-2);
            }}
          />
        )}

      {driving && (
        <TopLeftView style={{marginTop:getStatusBarHeight()}}>
          <MapInfoTouchableOpacity onPress={()=>{
            setInfoTouch(!infoTouch);
          }}>
            <TopLeftViewTouch>
              {infoTouch == true ? (
                <>
                  <NewTextViewData>
                    <NewTextViewRow>
                      <NewTextViewRow40>
                        <NewTextRight>???????????? : </NewTextRight>
                      </NewTextViewRow40>
                      <NewTextViewRow30>
                      {pushNum == 0 ? (
                        <NewTextRight>{typeof coordinate2.speed === "number" && coordinate2.speed >= 0 ? (coordinate2.speed*3.6).toFixed(1) : "0"}</NewTextRight>
                      ) : (
                        <NewTextRight><NewTextColor style={{color:"#FF0000"}}>{pushNum}</NewTextColor></NewTextRight>
                      )}
                      </NewTextViewRow30>
                      <NewTextViewRow30>
                        <NewTextLeft> km/h</NewTextLeft>
                      </NewTextViewRow30>
                    </NewTextViewRow>
                    <NewTextViewRow>
                      <NewTextViewRow40>
                        <NewTextRight>???????????? : </NewTextRight>
                      </NewTextViewRow40>
                      <NewTextViewRow60>
                        <NewTextCenter>{new Date(new Date().getTime()-_startTime).getHours()-9+" : "+new Date(new Date().getTime()-_startTime).getMinutes()+" : "+new Date(new Date().getTime()-_startTime).getSeconds()}</NewTextCenter>
                      </NewTextViewRow60>
                    </NewTextViewRow>
                    <NewTextViewRow style={{marginTop:8}}>
                      <NewTextViewRow40>
                        <NewTextRight>???????????? : </NewTextRight>
                      </NewTextViewRow40>
                      <NewTextViewRow60>
                        <NewTextCenter>
                          {linkInfo[4]==10?<NewTextColor style={{fontWeight:"bold"}}>??????</NewTextColor>:<NewTextColor style={{color:"#00000077"}}>??????</NewTextColor>} /
                          {linkInfo[4]==20?<NewTextColor style={{fontWeight:"bold"}}> ???</NewTextColor>:<NewTextColor style={{color:"#00000077"}}> ???</NewTextColor>} /
                          {linkInfo[4]==30?<NewTextColor style={{fontWeight:"bold"}}> ???</NewTextColor>:<NewTextColor style={{color:"#00000077"}}> ???</NewTextColor>}
                        </NewTextCenter>
                      </NewTextViewRow60>
                    </NewTextViewRow>
                    <NewTextViewRow>
                      <NewTextViewRow40>
                        <NewTextRight>???????????? : </NewTextRight>
                      </NewTextViewRow40>
                      <NewTextViewRow60>
                        <NewTextCenter>
                          {linkInfo[5]==1?<NewTextColor style={{fontWeight:"bold"}}>??????</NewTextColor>:<NewTextColor style={{color:"#00000077"}}>??????</NewTextColor>} /
                          {linkInfo[5]==2?<NewTextColor style={{fontWeight:"bold"}}> ??????</NewTextColor>:<NewTextColor style={{color:"#00000077"}}> ??????</NewTextColor>}
                        </NewTextCenter>
                      </NewTextViewRow60>
                    </NewTextViewRow>
                  </NewTextViewData>
                </>
              ) : (
                <TopLeftPadding>
                  <Text>
                    SLR : {linkInfo[4]==-1?"X":face(linkInfo[4])} / {linkInfo[5]==-1?"X":eyePoint(linkInfo[5])} / {linkInfo[6]==-1?"X":eyePoint(linkInfo[6])}
                  </Text>
                  <Text>
                    YPR : {linkInfo[1]==-1?"X":linkInfo[1]} / {linkInfo[2]==-1?"X":linkInfo[2]} / {linkInfo[3]==-1?"X":linkInfo[3]}
                  </Text>
                  <Text style={{marginTop:8}}>?????? : {coordinate2.latitude.toFixed(5)}</Text>
                  <Text>?????? : {coordinate2.longitude.toFixed(5)}</Text>
                  <Text>?????? : {typeof coordinate2.speed === "number" && coordinate2.speed >= 0 ? (coordinate2.speed*3.6).toFixed(1)+" km/h" : "0 km/h"}</Text>
                  {/* <Text>?????? : {parseInt((coordinate2.timestamp/1000).toString())}</Text> */}
                  <Text>?????? : {new Date(coordinate2.timestamp).getHours() + ":"+ new Date(coordinate2.timestamp).getMinutes() + ":"+ new Date(coordinate2.timestamp).getSeconds()}</Text>
                </TopLeftPadding>
              )}

              {/* <Text>?????? : {coordinate.latitude.toFixed(5)}</Text>
              <Text>?????? : {coordinate.longitude.toFixed(5)}</Text>
              <Text>?????? : {typeof coordinate.speed === "number" ? (coordinate.speed*3.6).toFixed(1)+" km/h" : ""}</Text>
              <Text>?????? : {parseInt((coordinate.timestamp/1000).toString())}</Text>
              <Text></Text> */}
              
            </TopLeftViewTouch>
          </MapInfoTouchableOpacity>
        </TopLeftView>
      )}

      <TopRightView style={{marginTop:getStatusBarHeight()}}>
        <IconButton
          style={{flex:1}}
          icon="menu"
          color="#000000"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      </TopRightView>

      <CenterRightView>
        <IconButton
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#AAA",
            borderRadius: 10,
            borderWidth: 1,
          }}
          icon="plus"
          color="#000000"
          onPress={() => {
            setCamera({
              center: {
                latitude: camera.center.latitude,
                longitude: camera.center.longitude
              },
              heading: 0,
              pitch: 0,
              zoom: camera.zoom+1,
              altitude: 0
            });
          }}
        />
        <IconButton
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#AAA",
            borderRadius: 10,
            borderWidth: 1,
          }}
          icon="minus"
          color="#000000"
          onPress={() => {
            setCamera({
              center: {
                latitude: camera.center.latitude,
                longitude: camera.center.longitude
              },
              heading: 0,
              pitch: 0,
              zoom: camera.zoom-1,
              altitude: 0
            });
          }}
        />
      </CenterRightView>
      
      {driving == true && infoTouch == true ? (
        <CenterTestTestRightView>
          <IconButton
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#AAA",
              borderRadius: 10,
              borderWidth: 1,
            }}
            icon="alarm-light"
            color="#BB0000"
            onPress={() => {
              console.log("report");
              setLinkInfo([-1,-1,-1, 151, 10, 1,-1, 0, 0,-1]);
          }}/>
          <IconButton
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#AAA",
              borderRadius: 10,
              borderWidth: 1,
            }}
            icon="sleep"
            color="#000000"
            onPress={() => {
              sound1 = new Sound(audioList[1].url, (error) => {
                if(error){
                  return;
                } else {
                  sound1.play((success)=>{
                    sound1.release();
                  })
                }
              });
              let {latitude, longitude, timestamp} = coordinate2;
              let _markerLocation = {
                latitude,
                longitude,
                bool_report: false,
                bool_sudden_acceleration: false,
                bool_sudden_stop: false,
                bool_sleep: true,
                timestamp, // ?????? ???????????? ?????????
              }
              console.log(_markerLocation);
              console.log(markerLocations.length);
              // ????????? ?????????
              setMarkerLocations([...markerLocations, _markerLocation]);
              if(onSave && userInfo2 && userInfo2.key){
                if(userInfo2.key != -1 && userInfo2.key != undefined){
                  // ????????? ???????????? ????????? ????????? ?????????
                  console.log(_markerLocation);
                  drivingMarkerSave(_markerLocation);
                }
              }
          }}/>
        </CenterTestTestRightView>
      ) : null }

    {driving == true ? (
      <CenterTestRightView>
        {/* ????????? */}
        <IconButton
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#AAA",
            borderRadius: 10,
            borderWidth: 1,
          }}
          size="32"
          icon="car-electric"
          color="#000000"
          onPress={() => {

            setPushNum(20);
            setInterPlus(true);
            setTimeout(()=>{
              console.log("????????? ??????");
              setInterPlus(false);
              setTimeout(()=>{
                setPushNum(0);
              }, 4500);

              sound1 = new Sound(audioList[0].url, (error) => {
                if(error){
                  return;
                } else {
                  sound1.play((success)=>{
                    sound1.release();
                  })
                }
              });
              let {latitude, longitude, timestamp} = coordinate2;
              let _markerLocation = {
                latitude,
                longitude,
                bool_report: false,
                bool_sudden_acceleration: true,
                bool_sudden_stop: false,
                bool_sleep: false,
                timestamp, // ?????? ???????????? ?????????
              }
              console.log(_markerLocation);
              console.log(markerLocations.length);
              // ????????? ?????????
              setMarkerLocations([...markerLocations, _markerLocation]);
              if(onSave && userInfo2 && userInfo2.key){
                if(userInfo2.key != -1 && userInfo2.key != undefined){
                  // ????????? ???????????? ????????? ????????? ?????????
                  console.log(_markerLocation);
                  drivingMarkerSave(_markerLocation);
                }
              }
            }, 1500);

          }}
        />
        {/* ????????? */}
        <IconButton
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#AAA",
            borderRadius: 10,
            borderWidth: 1,
          }}
          size="32"
          icon="car-off"
          color="#000000"
          onPress={() => {

            setPushNum(80);
            setInterMinus(true);
            setTimeout(()=>{
              console.log("????????? ??????");
              setInterMinus(false);
              setTimeout(()=>{
                setPushNum(0);
              }, 4500);

              sound1 = new Sound(audioList[2].url, (error) => {
                if(error){
                  return;
                } else {
                  sound1.play((success)=>{
                    sound1.release();
                  })
                }
              });
              let {latitude, longitude, timestamp} = coordinate2;
              let _markerLocation = {
                latitude,
                longitude,
                bool_report: false,
                bool_sudden_acceleration: false,
                bool_sudden_stop: true,
                bool_sleep: false,
                timestamp, // ?????? ???????????? ?????????
              }
              console.log(_markerLocation);
              console.log(markerLocations.length);
              // ????????? ?????????
              setMarkerLocations([...markerLocations, _markerLocation]);
              if(onSave && userInfo2 && userInfo2.key){
                if(userInfo2.key != -1 && userInfo2.key != undefined){
                  // ????????? ???????????? ????????? ????????? ?????????
                  console.log(_markerLocation);
                  drivingMarkerSave(_markerLocation);
                }
              }
            }, 1500);

          }}
        />
      </CenterTestRightView>
    ) : null }


      <BottomLeftViewGPS>
        <IconButton
          icon="crosshairs-gps"
          color="#000000"
          onPress={() => {
            Geolocation.getCurrentPosition(
              async position => {
                const {latitude, longitude, speed} = position.coords;
                const {timestamp} = position;
                setCoordinate({
                  latitude: latitude,
                  longitude: longitude,
                  speed: speed,
                  timestamp: timestamp,
                });
                setCamera( camera => {
                  return ({
                    center: {
                      latitude: latitude,
                      longitude: longitude
                    },
                    heading: 0,
                    pitch: 0,
                    zoom: camera.zoom,
                    altitude: 0
                  });
                });
              },
              error => {
                console.log(error.code, error.message);
              },
              {
                timeout: 0,
                maximumAge: 0,
                enableHighAccuracy: true,
              }
            );
          }}
        />
      </BottomLeftViewGPS>
      {driving && (<BottomLeftViewEye>
        <IconButton
          icon={onPolyline?"eye":"eye-off"}
          color={onPolyline?"#00FA":"#AAAA"}
          onPress={() => {
            setOnPolyline(!onPolyline);
            setOnMarker(!onMarker);
          }}
        />
      </BottomLeftViewEye>)}

      <BottomRightView style={driving?{backgroundColor:"#00F"}:{backgroundColor:"#FFF"}}>
        <Btn
          onPress={()=>{
            if(driving){
              
              // ???????????????
              // _drivingSaveData.Drivingline = [...locations];
              let _drivingSaveData = Object.assign({}, drivingSaveData);
              let _endT = new Date().getTime();
              _setEndTime(() => _endT);
              // console.log(locations);

              if(locations){
                if(userInfo2 && userInfo2.key){
                  _drivingSaveData.webUserId = userInfo2.key;
                }
                if(userInfo2 && userInfo2.name){
                  _drivingSaveData.Drivingline = locations;
                  _drivingSaveData.name = userInfo2.name;
                  _drivingSaveData.startTime = _startTime;
                  _drivingSaveData.endTime = _endT;
                }
                if(markerLocations != undefined){
                  if(markerLocations.length > 1){
                    console.log("???????????? ????????????");
                    _drivingSaveData.DrivingMarker = markerLocations;
                  }
                }
                if(_drivingSaveData.endTime && _drivingSaveData.startTime){
                  if(_drivingSaveData.endTime-_drivingSaveData.startTime > 500){
                    console.log("????????? ???????????????");
                    drivingSave(_drivingSaveData);
                  }
                }
              }
              setDrivingSaveData(undefined);
              setLocations([]); // ?????????
              setMarkerLocations([]);
              // ???????????????

              // ??????????????? ????????? ??????
              let _defaultInfo = [...defaultInfo];
              _defaultInfo[4] = 0;
              setDefaultInfo(_defaultInfo);
              // ??????????????? ????????? ??????
              
              // // --- ???????????? ??????
              let _checkInfo = [...checkInfo];
              _checkInfo[0] = 0;
              _checkInfo[1] = 1;
              _checkInfo[2] = 0;
              _checkInfo[3] = 0;
              _checkInfo[4] = 0;
              _checkInfo[6] = 0;
              _checkInfo[7] = 0;
              _checkInfo[8] = 0;
              _checkInfo[9] = 0;
              _checkInfo[10] = 0;
              _checkInfo[11] = 11;
              setCheckInfo(_checkInfo);
              setLinkInfo([-1,-1,-1, -1,  -1,-1,-1, 0, 0,-1]);
              // // --- ???????????? ??????
              Geolocation.clearWatch(0);

              // --- ?????? ???????????? ????????? ...
              _setStartTime(0);
              // --- ?????? ???????????? ????????? ...

              setDriving(false); // ??????
              setOnSave(false); // ??????

              setModalVisibleSave(true);
              setTimeout(() => {
                setModalVisibleSave(false);
              }, 2000);
              console.log("????????? ???????????????");
              
            } else {
              setModalVisibleStart(true);
              setTimeout(() => {
                setModalVisibleStart(false);
              }, 1500);
              setTimeout(() => {
                if(userInfo2 && userInfo2.key){
                  if(userInfo2.key != -1 && userInfo2.key != undefined){
                    console.log("????????? ??????, ?????? ??????????????? ??????");
                    drivingStart(); // ???????????? ??????
                  }
                }
                setOnPolyline(true);
                setOnMarker(true);

                // ???????????????
                // save ?????? ?????????
                setLocations([]);
                setMarkerLocations([]);
                _setStartTime(new Date().getTime());
                // ???????????????
                
                // ????????????
                let _checkInfo = [...checkInfo];
                _checkInfo[0] = 0;
                _checkInfo[1] = 1;
                _checkInfo[2] = 0;
                _checkInfo[3] = 0;
                _checkInfo[4] = 0;
                _checkInfo[5] = 0;
                _checkInfo[6] = 0;
                _checkInfo[7] = 0;
                _checkInfo[8] = 0;
                _checkInfo[9] = 0;
                _checkInfo[10] = 0;
                _checkInfo[11] = 11;
                setCheckInfo(_checkInfo);
                setLinkInfo([-1,-1,-1, -1,  -1,-1,-1, 0, 0,-1]);

                // ??????????????? ????????? ??????
                let _defaultInfo = [...defaultInfo];
                _defaultInfo[4] = 1;
                setDefaultInfo(_defaultInfo);
                // ??????????????? ????????? ??????

                Geolocation.watchPosition(
                  position => {
                    let now = new Date();
                    const {latitude, longitude, speed} = position.coords;
                    const {timestamp} = position;
                    setCoordinate({
                      latitude: latitude,
                      longitude: longitude,
                      speed: speed,
                      timestamp: timestamp,
                    });
                    if(driving){
                      setCamera( camera => {
                        return ({
                          center: {
                            latitude: latitude,
                            longitude: longitude
                          },
                          heading: 0,
                          pitch: 0,
                          zoom: camera.zoom,
                          altitude: 0
                        });
                      });
                    }
                  },
                  error => {
                    console.log(error);
                  },
                  {
                    timeout: 0,
                    maximumAge: 0,
                    enableHighAccuracy: true,
                    distanceFilter: 1,
                  },
                );
                setDriving(true); // ??????
                setOnSave(true); // ??????
              }, 2000);
            }
          }}
        >
          <BtLabel style={driving?{color:"#FFFFFF"}:{}}>
            {driving?"?????? ??????":"?????? ??????"}
          </BtLabel>
        </Btn>
      </BottomRightView>

      {checkInfo[3] == 1 ?(
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleReportCount}
        >
          <ModalView>
            <LottieViewMyView>
              <LottieView
                style={{backgroundColor:'#FFFFFF'}}
                resizeMode={'contain'}
                source={require('~/Assets/Lottie2/i119_count.json')}
                autoPlay
                imageAssetsFolder={'images'}
              />
            </LottieViewMyView>
            <SingoTextView>
              <SingoText>????????? ?????????????????????</SingoText>
              <SingoText>?????? ????????? ????????? ?????????</SingoText>
              <SingoText>?????? ????????? ???????????????</SingoText>
              <SingoTextCount>
                {checkInfo[4]>=0 && checkInfo[4]<10 ? (10-checkInfo[4]) : " "}
              </SingoTextCount>
            </SingoTextView>
            <TouchableOpacityView>
              <TouchableOpacity // ?????? ?????? ??????
                onPress={() => {
                  console.log("?????? ??????");
                  setModalVisibleReportCount(false);
                  let _checkInfo = [...checkInfo];
                  _checkInfo[2] = 0;
                  _checkInfo[3] = 0;
                  _checkInfo[4] = 0;
                  _checkInfo[11] = 119;
                  setCheckInfo(_checkInfo);
                  setLinkInfo([-1,-1,-1, -1,  -1,-1,-1, 0, 0,-1]);

                  setTimeout(() => {
                    let __checkInfo = [...checkInfo];
                    __checkInfo[2] = 0;
                    __checkInfo[3] = 0;
                    __checkInfo[4] = 0;
                    __checkInfo[11] = 11;
                    setCheckInfo(__checkInfo);
                  }, 10000);

                  sound1 = new Sound(audioList[6].url, (error) => {
                    if(error){
                      return;
                    } else {
                      sound1.play((success)=>{
                        sound1.release();
                      })
                    }
                  });
                }}>
                <ReportCancelBtn>?????? ??????</ReportCancelBtn>
              </TouchableOpacity>
            </TouchableOpacityView>
          </ModalView>
        </Modal>
      ) : null }
      {driving ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleSleep}
        >
          <SleepModalView>
            <SleepModalImageTextView>
              <SleepAlertImage
                source={require('~/Assets/Images/sleepAlertIcon.png')}
              />
              <SleepAlertText>?????? ?????? !</SleepAlertText>
            </SleepModalImageTextView>
          </SleepModalView>
        </Modal>
      ) : null }
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleStart}
      >
        <ModalViewBack>
          <DrivingStartSaveModalView style={{borderColor: "#008800"}}>
            <LottieStartSaveView>
              <LottieView
                style={{backgroundColor:'#FFFFFF'}}
                resizeMode={'contain'}
                source={require('~/Assets/Lottie2/car_start.json')}
                autoPlay
                imageAssetsFolder={'images'}
              />
            </LottieStartSaveView>
            <DrivingStartSaveTextView>
              <DrivingStartSaveText>????????? ???????????????</DrivingStartSaveText>
            </DrivingStartSaveTextView>
          </DrivingStartSaveModalView>
        </ModalViewBack>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleSave}
      >
        <ModalViewBack>
          <DrivingStartSaveModalView style={{borderColor: "#0000FF"}}>
            <LottieStartSaveView>
              <LottieView
                style={{backgroundColor:'#FFFFFF'}}
                resizeMode={'contain'}
                source={require('~/Assets/Lottie2/car_save.json')}
                autoPlay
                imageAssetsFolder={'images'}
              />
            </LottieStartSaveView>
            <DrivingStartSaveTextView>
              <DrivingStartSaveText>????????? ???????????????</DrivingStartSaveText>
            </DrivingStartSaveTextView>
          </DrivingStartSaveModalView>
        </ModalViewBack>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleReportOk}
      >
        <ReportOkModalView>
          <ReportOKText2>Kurumamori 119</ReportOKText2>
          <ReportTouchableOpacity
            onPress={()=>{
              if(soundReal){
                soundReal.pause();
                soundReal.setCurrentTime(0);
                soundReal.getCurrentTime((seconds) => console.log('at ' + seconds));
                setModalVisibleReportOk(false);
              }
            }}
          >
            <ReportOKImage
              resizeMode="contain"
              source={require('~/Assets/Images/reportOK.png')}
            />
          </ReportTouchableOpacity>
          <ReportOKText>????????????, ???????????? ??????</ReportOKText>
          <ReportOKText2>????????? ??????????????????</ReportOKText2>
        </ReportOkModalView>
      </Modal>
    </>
  );
};

export default MapData;

