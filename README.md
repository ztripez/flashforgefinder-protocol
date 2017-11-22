# flashforgefinder-proxy
A  reverse engineering of Flash Forge Finder WIFI protocol


Capture is done with Wireshark over Ethernet, if this is successful I'll maybe take a look into the USB protocol also.

The pca-captures are located in the wireshark folder, label the scenario made. Also all pca-cap has a tcp-folow in markdown.




## Findings so far:

The protocol look quite simple, with the client sending a code with parameters to the printer that responds with the result.

### Example:
Client:<br>
```~M27```

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
| M27  | CMD M119 Received. Endstop: X-max: 1 Y-max: 0 Z-max: 1<br>Status: S:1 L:0 J:0 F:1<br>MachineStatus: READY<br>MoveMode:  READY<br>ok | false    | Get repeated often, guessing it's used as a PING |
