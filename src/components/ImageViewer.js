import React from 'react'
import {Modal, View} from 'react-native'
import FastImage from 'react-native-fast-image'
import RNFS from 'react-native-fs'
import RnHash, {CONSTANTS} from 'react-native-hash'
class ImageViewer extends React.Component{

    constructor(props){
        super(props);
        this.state ={
            source : null
        }
    }

    loadFile = ( path )=> {
       console.log('path----')
        this.setState({ source:{uri:path}}) ;
      }
  downloadFile = (uri,path) => {
    console.log('hello1 ',uri)
    console.log('path ', path)
    RNFS.downloadFile({
         fromUrl:uri,
         toFile: path
        }).promise
        .then(res =>this.loadFile(path))
        .catch((error) => console.log("prob::" ,error))
   }

    componentDidMount(){
        var {uri} = this.props
       RnHash.hashString(uri, CONSTANTS.HashAlgorithms.sha256)
       .then(hash => {
            const name = hash;
            const extension = 'file://';
        const path =`${extension}${RNFS.CachesDirectoryPath}/${name}.jpg`;

        RNFS.exists(path).then( exists => {
            console.log(exists)
            if(exists){
                this.loadFile(path) ;
            }
            else this.downloadFile(uri,path) ;

            console.log("state ", this.state.source,"check ",exists)
          })
       })
       .catch(err => console.log(err))
        
    }
    render(){
        console.log('after ',this.state.source)
        return(   
            <View>
                <Modal
                animationType= 'fade'
                style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%) !important'}}
                transparent = {false}
                onRequestClose= {() =>this.props.onClose()}
                visible = {this.props.modal}
                >
                    <View style={{flex:1 ,alignItems: 'center', justifyContent: 'center'}}>
                            <FastImage style={{width: "98%", height: 400}} 
                            source={this.state.source}/>
                    </View>
                </Modal>
            </View>
           )
    }
    
}

export default ImageViewer