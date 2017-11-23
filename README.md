# flashforgefinder-protocol
A  reverse engineering of Flash Forge Finder WIFI protocol

Capture is done with Wireshark over Ethernet, if this is successful I'll maybe take a look into the USB protocol also.
The pca-captures are located in the wireshark folder, label the scenario made. Also all pca-cap has a tcp-folow in markdown.




## Findings so far:

This was much easier than expected. The printer talks G-code directly over tcp socket. As soon as the M-code M601 is sent you can talk both G and M code directly to the printer. 

Now I only need to figure out what M-codes are supported.


If I keep the connection open and connect with the FlashPrint software at the same time, the ff-toolbox receives data from the printer.
(side note: this is a bit interesting, you are unable to be connected to the printer with 2 instances of flashprint, but I'm able to be with a simple tcp socket)

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
| Code | Response | Verified | Comment                                          |
|-|-|-|-|
| ~M601 S1 |CMD M601 Received.<br>Control Success.<br>ok<br>|true| Login Command|
| ~M602 |CMD M601 Received.<br>Control Release.<br>ok|true| Logout Command|
| ~M27  | CMD M119 Received. Endstop: X-max: 1 Y-max: 0 Z-max: 1<br>Status: S:1 L:0 J:0 F:1<br>MachineStatus: READY<br>MoveMode:  READY<br>ok | false    |  |
| ~M146 r255 g255 b255 F0 ||true| Sets the color of the leds|
