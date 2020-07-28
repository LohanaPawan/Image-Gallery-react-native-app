import React, { Component } from 'react'
import { Container, Content, Header,Item, Text, Input, Icon, List, ListItem, Button } from 'native-base'
import {  Image, View, Keyboard} from 'react-native'
import axios from 'axios'
import RNFS from 'react-native-fs'
import ImageViewer from '../components/ImageViewer'
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isData: true,
            data: [],
            component: null,
            tag: 'food',
            modalVisible: false
        }
        image = null
        this.renderItems = this.renderItems.bind(this)
        this.updateState = this.updateState.bind(this)
    }
    async fetchData() {
        Keyboard.dismiss
        try {
            const response = await axios.get('https://api.flickr.com/services/rest/', {
                params: {
                    method: "flickr.photos.getRecent",
                    api_key: '636e1481b4f3c446d26b8eb6ebfe7127',
                    tag: this.state.tag,
                    per_page: 15,
                    format: 'json',
                    nojsoncallback: 1
                }
            })
            console.log("234")
            if (response.data.photos.photo.length > 0) {
                    console.log('if')
                this.setState({
                    data: response.data.photos.photo,
                    isData: true
                })
            }else {
                console.log('else')
                this.setState({
                component: <Text> No images found for {tag}</Text>
                })
            }

        } catch (err) {
            console.log(err)
            const extension = 'file://';
            const path = `${extension}${RNFS.CachesDirectoryPath}`

            RNFS.readDir(path)
            .then(res => {
               for(let item of res){
                   if(item.name !== 'http-cache' && item.name !== 'image_cache' && item.name !== 'image_manager_disk_cache' )
                   this.state.data.push("file://" + item.path)  
               }
               this.setState({
                isData: false,  
            })
            }).catch(error => {console.log(error)})
           
        }
    }

    componentDidMount(){
        this.fetchData()
    }

    showImage(item) {
        console.log("pic clicked")
        this.image = `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}_m.jpg`;
        this.setState({
            modalVisible: true,
            component: <ImageViewer uri={this.image} onClose={() => this.close()} modal={true} />
        })
    }

    close() {
        this.setState({ modalVisible: false })
    }

    // For list items
    renderItems(item) {
        const { isData } = this.state
        var address;
        if (isData) {
            address = `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}_m.jpg`
        } else {
            address = item
            //console.log('address ',address)
        }
        return (
            <ListItem key={item.id} onPress={() => this.showImage(item)}>

                <Image style={{ width: 100, height: 100 }}

                    source={{ uri: address }}
                />
            </ListItem>
        )
    }

    updateState(text){
        this.setState({
            tag: text
        })
    }

    render() {
        console.log(this.state.data)
        let {tag} = this.state 
        let inputVal = tag     
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="search" />
                        <Input
                            placeholder="Search images"
                            onChangeText = {(text) => this.updateState(text)}
                           
                            onEndEditing = {() => Keyboard.dismiss}
                        />
                       <Button transparent
                       onPress = {() => {this.fetchData()
                       
                       }}>
                           <Text> Submit</Text>
                       </Button>
                    </Item>
                </Header>
                <Content>
                    <View>
                        <List
                            dataArray={this.state.data}
                            renderRow={(item) => this.renderItems(item)}
                            horizontal={false}
                            numColumns={3}
                        />

                    </View>
                    {this.state.modalVisible ? this.state.component : null}
                </Content>
            </Container>
        )
    }
}