import Foundation
import Vision
import CoreImage
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
let input = URL(fileURLWithPath: args[1]), output = URL(fileURLWithPath: args[2])
let handler = VNImageRequestHandler(url: input)
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
guard let obs = req.results?.first else { print("no subject"); exit(1) }
let buf = try obs.generateMaskedImage(ofInstances: obs.allInstances, from: handler, croppedToInstancesExtent: false)
let ci = CIImage(cvPixelBuffer: buf)
let ctx = CIContext()
try ctx.writePNGRepresentation(of: ci, to: output, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
print("ok")
