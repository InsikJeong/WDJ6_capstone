import React, {useContext, useState, useEffect} from 'react';
import Styled from 'styled-components/native';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';

import IconButton from '~/Components/IconButton';
import Button from '~/Components/Button';

import {
  FlatList, Platform, Alert,
  PermissionsAndroid, AppState, StatusBar,
  NativeModules, NativeEventEmitter,} from 'react-native';

import {DrivingDataContext} from '~/Contexts/DrivingData';
import Geolocation from 'react-native-geolocation-service';
import Sound from 'react-native-sound';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import { getBottomSpace } from 'react-native-iphone-x-helper';

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
  }
]

const Text = Styled.Text`
  font-size: 16px;
`;
const TopLeftView = Styled.View`
  position: absolute;
  background-color: #FFFFFFDD;
  border-color: #00F;
  border-width: 2px;
  border-radius: 16px;
  top: 1%;
  left: 2%;
  width: 50%;
  padding: 5% 10%;
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
  top: 44%;
  width: 40px;
  height: 12%;
`;
const BottomLeftView = Styled.View`
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
const Bt = Styled.TouchableOpacity`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const BtLabel = Styled.Text`
  font-size: 20px;
`;
const SingoView = Styled.View`
  position: absolute;
  background-color: #FFFFFF;
  border-radius: 20px;
  border-width: 5px;
  border-color: #F00;
  top: 10%;
  left: 5%;
  right: 5%;
  bottom: 10%;
  justify-content: center;
  align-items: center;
  padding: 10%;
`;
const SingoTextView = Styled.View`
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`;
const SingoText = Styled.Text`
  font-size: 32px;
`;
const SingoCancelBtn = Styled.TouchableOpacity`
  width: 200px;
  height: 200px;
  border-radius: 20px;
  border-width: 5px;
  border-color: #F00;
  justify-content: center;
  background-color: #DDDD;
  align-items: center;
`;
const SingoCancelBtnText = Styled.Text`
  font-size: 96px;
`;


// position:"absolute", top:60, right:24, width:50, height:50, backgroundColor:"#0008", borderRadius:30, paddingTop:2

interface IGeolocation {
  latitude: number;
  longitude: number;
}
interface ICoordinate {
  latitude: number;
  longitude: number;
  speed: number;
  timestamp: number;
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
    if(num==0) return "X";
    if(num==10) return "??????";
    if(num==20) return "??????";
    if(num==30) return "?????????";
    return "";
  }
  const eyePoint = (num:number) :string => {
    if(num==0) return "X";
    if(num==1) return "On";
    if(num==2) return "Off";
    return "";
  }

  const [modal, setModal] = useState<boolean>(false);

  const {linkInfo, setLinkInfo, defaultInfo, setDefaultInfo, checkInfo, setCheckInfo} = useContext(DrivingDataContext);
  const [testDrawer, setTestDrawer] = useState<Array<number>>([]);

  const [marginTop, setMarginTop] = useState<number>(1);

  const [speed, setSpeed] = useState<number>(0);
  const [onSave, setOnSave] = useState<boolean>(false);
  const [driving, setDriving] = useState<boolean>(false);
  const [onTime, setOnTime] = useState<any>();

  const [coordinate, setCoordinate] = useState<ICoordinate>({
    latitude: 0.0000,
    longitude: 0.0000,
    speed: 0.0000,
    timestamp: 0, // Milliseconds since Unix epoch
  });
  
  const [location, setLocation] = useState<IGeolocation>({
    latitude: 35.896311,
    longitude: 128.622051,
  });

  const [region, setRegion] = useState<any>({
    latitude: 35.896311,
    longitude: 128.622051,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  });

  const [locations, setLocations] = useState<Array<IGeolocation>>([]);
  let sound1: Sound;
  let singoSetTimeout: NodeJS.Timeout;

  //  ##### ##### ##### ##### ##### ##### ##### ##### #####  useEffect
  useEffect(() => {
    // ????????????
    // setCheckInfo([-1,-1,-1,-1, -1,-1,-1,-1,-1,-1]); 
    androidPermissionLocation();
    console.log("--- --- MapData Mount");

    //   let id = setInterval(() => {
    //     let now = new Date();
    //     // console.log(now.getHours());
    //     // console.log(now.getMinutes());
    //     // console.log(now.getSeconds());
    //     setOnTime(now.getSeconds()); // ?????? ??????
    //     linkInfo_3(); // ????????????
    //     linkInfo_4(); // ?????? ??????
    //     linkInfo_5(); // ????????????
    //     // console.log(checkInfo);
    //     // console.log(_checkInfo());
    //     // console.log(_linkInfo());
    //   }, 1000);
    // return () => {
    //   console.log("--- --- MapData return");
    //   clearInterval(id);
    // };

  },[]);
  //  ##### ##### ##### ##### ##### ##### ##### ##### #####  useEffect

  let linkInfo_3 = ():void => {
    // if(driving){ // ???????????? ??????
      if(checkInfo[2] != 1){ // ?????? ?????? ??????
        if(linkInfo[3] != -1){ // ????????? ???????????? ????????????????????? ??????
          if(linkInfo[3] < 70 || 130 < linkInfo[3]){ // ?????????????????? ??????
            console.log("????????? ??????");

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

            setModal(true);
            singoSetTimeout = setTimeout(() => {

              setModal(false);
              // // ???????????? http ?????? ????????????

              // ????????? ????????? ??????
              sound1 = new Sound(audioList[7].url, (error) => {
                if(error){
                  return;
                } else {
                  sound1.play((success)=>{
                    sound1.release();
                  })
                }
              });
            }, 10000);

            let _checkInfo = checkInfo;
            _checkInfo[2] = 1;
            setCheckInfo(_checkInfo);
          }
        }
      }
    // }
  };

  let linkInfo_4Cnt = 0; // ?????? ?????????
  let linkInfo_4 = ():void => {
    // if(driving){ // ???????????? ??????

    // ???????????? ??????
    // if(checkInfo[10] != 1){ // ???????????? ?????? ??????
    //   if(linkInfo[10] != -1){ // ?????? ???????????? ????????? ??????
        if(linkInfo[4] == 30 || linkInfo[4] == 20){
          linkInfo_4Cnt++; // sleep ?????? ??????
          console.log("?????? ??????", linkInfo_4Cnt);
            if(linkInfo_4Cnt > 5){
              linkInfo_4Cnt = 0;
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

              // let _checkInfo = checkInfo;
              // _checkInfo[10] = 1;
              // setCheckInfo(_checkInfo);

              // setTimeout(() => {
              //   let _checkInfo = checkInfo;
              //   _checkInfo[10] = 0;
              //   setCheckInfo(_checkInfo);
              // }, 5000);
            }
        } else if( linkInfo[4] == 10 ){
          console.log("?????? ?????? ??????", linkInfo_4Cnt);
          if(linkInfo_4Cnt>1){
            linkInfo_4Cnt -= 2;
          }
        } else {

        }
    //     }
    //   }
    // }
      // }
  }

  let linkInfo_5Cnt = 0; // ?????? ?????????
  let linkInfo_5 = ():void => {
    // if(driving){ // ???????????? ??????

    // if(checkInfo[8] != 1){ // ?????? ?????? ??????
    //   if(linkInfo[5] != -1){ // ??? ?????? ???????????? ????????? ??????
        if(linkInfo[5] == 2 && linkInfo[6] == 2){ // ?????? ??????????????? ??????
          linkInfo_5Cnt++; // sleep ?????? ??????
          console.log(">>        ?????? ??????", linkInfo_5Cnt);
            if(linkInfo_5Cnt > 8){
              linkInfo_5Cnt = 0;
              // ???????????? ?????? ?????????
              sound1 = new Sound(audioList[1].url, (error) => {
                if(error){
                  return;
                } else {
                  sound1.play((success)=>{
                    sound1.release();
                  })
                }
              });
              

              // let _checkInfo = checkInfo;
              // _checkInfo[8] = 1;
              // setCheckInfo(_checkInfo);

              // setTimeout(() => {
              //   let _checkInfo = checkInfo;
              //   _checkInfo[8] = 0;
              //   setCheckInfo(_checkInfo);
              // }, 5000);
            }
        } else if (linkInfo[5] == 1 && linkInfo[6] == 1){
          console.log(">>        ?????? ?????? ??????", linkInfo_5Cnt);
          if(linkInfo_5Cnt>1){
            linkInfo_5Cnt -= 2;
          }
        } else {

        }
    //     }
    //   }
    // }
      // }
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

        region={region}

        onUserLocationChange={ e => {
          if(onSave){
            setCoordinate({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
              speed: e.nativeEvent.coordinate.speed,
              timestamp: e.nativeEvent.coordinate.timestamp,
            });
            // ?????? ??????????????????
            // const {latitude, longitude} = e.nativeEvent.coordinate;
            // setLocations([...locations, {latitude, longitude}]);
            // ?????? ??????????????????

            // ?????? ?????? ???????????? ????????? ???????????????
            // console.log("-> linkInfo ", linkInfo);
            // console.log("-> defaultInfo ", defaultInfo);
            // console.log("-> checkInfo ", checkInfo);
          }
        }}
      >
        {/* {onSave && (<Polyline
          coordinates={locations}
          strokeWidth={3}
          strokeColor="#00F" 
        />)} */}
      </MapView>

      {driving && (
        <TopLeftView style={{marginTop:getStatusBarHeight()}}>
          <Text>
            SLR : {linkInfo[4]==-1?"X":face(linkInfo[4])} / {linkInfo[5]==-1?"X":eyePoint(linkInfo[5])} / {linkInfo[6]==-1?"X":eyePoint(linkInfo[6])}
          </Text>
          <Text>
            YPR : {linkInfo[1]==-1?"X":linkInfo[1]} / {linkInfo[2]==-1?"X":linkInfo[2]} / {linkInfo[3]==-1?"X":linkInfo[3]}
          </Text>
          <Text>?????? : {coordinate.latitude.toFixed(4)}</Text>
          <Text>?????? : {coordinate.longitude.toFixed(4)}</Text>
          <Text>?????? : {coordinate.speed.toFixed(1)}</Text>
          <Text>?????? : {parseInt((coordinate.timestamp/1000).toString())}</Text>
          <Text>{onTime}</Text>
        </TopLeftView>
      )}

      <TopRightView
        style={{marginTop:getStatusBarHeight()}}
      >
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
            setRegion({
              latitude: region.latitude,
              longitude: region.longitude,
              latitudeDelta: region.latitudeDelta - (region.latitudeDelta/2),
              longitudeDelta: region.longitudeDelta - (region.longitudeDelta/2),
            });
            console.log(region);
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
            setRegion({
              latitude: region.latitude,
              longitude: region.longitude,
              latitudeDelta: region.latitudeDelta * 2,
              longitudeDelta: region.longitudeDelta * 2,
            });
            console.log(region);
          }}
        />
      </CenterRightView>

      <BottomLeftView>
        <IconButton
          icon="crosshairs-gps"
          color="#000000"
          onPress={() => {
            Geolocation.getCurrentPosition(
              async position => {
                const {latitude, longitude} = position.coords;
                setRegion({
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: region.latitudeDelta,
                  longitudeDelta: region.longitudeDelta,
                })
                console.log(position.coords);
                console.log("????????????");
              },
              error => {
                console.log(error.code, error.message);
              },
              {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
            );
          }}
        />
      </BottomLeftView>

      <BottomRightView
        style={driving?{backgroundColor:"#00F"}:{backgroundColor:"#FFF"}}
      >
        <Bt
          onPress={()=>{
            if(driving){
              Alert.alert('????????? ???????????????');
              checkInfo[0] = 0; // ???????????????????????????????????? ????????????
              setLocations([]); // ???????????????
              // --- ???????????? ??????
              let _checkInfo = checkInfo;
              _checkInfo[2] = 0;
              setCheckInfo(_checkInfo);
              // --- ???????????? ??????
            } else {
              Alert.alert('????????? ???????????????');
              checkInfo[0] = 1; // ???????????????????????????????????? ????????????
            }
            setDriving(!driving); // ??????
            setOnSave(!onSave); // ??????
          }}
        >
          <BtLabel style={driving?{color:"#FFFFFF"}:{}}>
            {driving?"?????? ??????":"?????? ??????"}
          </BtLabel>
        </Bt>
      </BottomRightView>
      {modal &&
        <SingoView>
          <SingoTextView>
            <SingoText>????????? ?????????????????????</SingoText>
            <SingoText>?????? ????????? ??????????????????</SingoText>
            <SingoText>?????? ????????? ???????????????</SingoText>
          </SingoTextView>
            <SingoCancelBtn
              onPress={()=>{
                clearTimeout(singoSetTimeout);
                setModal(false);
                // ????????????
                sound1 = new Sound(audioList[6].url, (error) => {
                  if(error){
                    return;
                  } else {
                    sound1.play((success)=>{
                      sound1.release();
                    })
                  }
                });
                setTimeout(() => {
                  let _checkInfo = checkInfo;
                  _checkInfo[2] = 0;
                  setCheckInfo(_checkInfo);
                }, 5000);
              }}
            >
            <SingoCancelBtnText>??????</SingoCancelBtnText>
          </SingoCancelBtn>
        </SingoView>
      }
    </>
  );
};

export default MapData;

