# flashforgefinder-proxy
A  reverse engineering of Flash Forge Finder WIFI protocol


Capture is done with Wireshark over Ethernet, if this is successful I'll maybe take a look into the USB protocol also.

The pca-captures are located in the wireshark folder, label the scenario made. Also all pca-cap has a tcp-folow in markdown.




## Findings so far:

~~If I'm connecting to the printer with a tcp socket (see ff-toolbox) I get a connection, but it doesn't send any data or responds to any command.
I'm guessing the command is not sent as a string.~~


The protocol is quite simple, with the client sending a code with parameters ending with a CR to the printer that responds with the result.
The client connects and send ~M601 S1 to get control, server responds with
```
Received: CMD M601 Received.
Control Success.
ok
```

if the client doesn't send any more commands over a certain amount of time (haven't clocked it yet) the printer sends:
```
Received: Control Release.
```

I'm guessing the command M27 is used as a ping to keep the control alive.


If I keep the connection open and connect with the FlashPrint software at the same time, the ff-toolbox receives data from the printer.
(side note: this is a bit interesting, you are unable to be connected to the printer with 2 instances of flashprint, but I'm able to be with a simple tcp socket)

All that is left is to map all the codes.

### Example:
Client:<br>
```~M27\n```

Printer:
```CMD M27 Received.
SD printing byte 5525653/5525652
ok
```

Client:<br>
```~M119```

Printer:
```CMD M119 Received.
Endstop: X-max: 1 Y-max: 0 Z-max: 1
Status: S:1 L:0 J:0 F:1
MachineStatus: READY
MoveMode: READY
ok
```

## Command List
| Code | Response                                                                                                                | Verified | Comment                                          |
|-|-|-|-|
| ~M601 S1 ||
| ~M27  | CMD M119 Received. Endstop: X-max: 1 Y-max: 0 Z-max: 1<br>Status: S:1 L:0 J:0 F:1<br>MachineStatus: READY<br>MoveMode:  READY<br>ok | false    | Get repeated often, guessing it's used as a PING |
