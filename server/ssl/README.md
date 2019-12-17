# SSL Certificates

You have to copy here your SSL certificates otherwise the HTTPS server
fails to start.


## Self-signed certificates

TLS/SSL is a public/private key infrastructure. Each client and each server 
must have a private key. A private key is created like this:

    $ openssl genrsa -out server-key.pem 1024

All severs and some clients need to have a certificate. Certificates are
public keys signed by a Certificate Authority or self-signed. The first
step to getting a certificate is to create a "Certificate Signing Request"
(CSR) file. This is done with:

    $ openssl req -new -key server-key.pem -out server-csr.pem

To create a self-signed certificate with the CSR, do this:

    $ openssl x509 -req -in server-csr.pem -signkey server-key.pem -out server-cert.pem

And finally, copy the files `server-key.pem` and `server-cert.pem` in this directory.
