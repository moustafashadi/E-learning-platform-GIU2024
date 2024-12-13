import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { subscribe } from "diagnostics_channel";
import { Server, Socket } from "socket.io"
import { Student, User, UserDocument } from "src/user/models/user.schema";
import { Chat, ChatDocument } from "./chat.schema";
import { Message, messageDocument } from "../messages/message.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserService } from "src/user/services/user.service";
import { Injectable, Req } from "@nestjs/common";
import { Client } from "socket.io/dist/client";
import { Request } from "express";
import { CreateMessageDto } from "../messages/dto/create-message.dto";

@WebSocketGateway(3002)
@Injectable()
export class GateWay implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly userService: UserService, // Service to fetch users from the database
    ) { }

    handleConnection(client: Socket) {
        console.log(`${client.id} have joined the chat`)
        this.server.emit('user-joined', {
            message: `${client.id} have entered the chat`,
        });
    }

    handleDisconnect(client: User) {
        console.log(`${client.username} have left the chat`)

        this.server.emit('user-left', {
            meesage: `${client.username} have left the chat`,
        });
    }

    @WebSocketServer()
    server: Server
    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id);
            console.log('connected')
        })
    }

    @SubscribeMessage("newMessage")
    handleNewMessage(client: Socket, createMessageDto: CreateMessageDto, @Req() req: Request) {
        console.log(createMessageDto);
        client.broadcast.emit('onMessage', {
            msg: createMessageDto,
            from: this.userService.getCurrentUser(req)
        });
        // console.log(user.username)
    }

}
